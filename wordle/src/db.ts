import { MongoClient, type Db, type Collection } from "mongodb";

const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME || "wordle";

if (!uri) {
  throw new Error("MONGO_URI is not defined. Set it in .env or your environment.");
}

const client = new MongoClient(uri);
let db: Db;
let playersCollection: Collection<PlayerStatsDoc>;
let gamesCollection: Collection<GameRecordDoc>;

export interface PlayerStats {
  playerId: string;
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  lastPlayedDate: string | null;
}

export interface GameRecord {
  playerId: string;
  date: string;
  solution: string;
  attempts: string[];
  won: boolean;
}

interface PlayerStatsDoc extends PlayerStats {
  createdAt: Date;
  updatedAt: Date;
}

interface GameRecordDoc extends GameRecord {
  createdAt: Date;
}

export async function initializeDatabase() {
  await client.connect();
  db = client.db(dbName);
  playersCollection = db.collection<PlayerStatsDoc>("players");
  gamesCollection = db.collection<GameRecordDoc>("games");

  await playersCollection.createIndex({ playerId: 1 }, { unique: true });
  await gamesCollection.createIndex({ playerId: 1, date: 1 }, { unique: true });
  await gamesCollection.createIndex({ playerId: 1 });
  await gamesCollection.createIndex({ date: 1 });
}

export async function getPlayerStats(playerId: string): Promise<PlayerStats | null> {
  const doc = await playersCollection.findOne({ playerId });
  if (!doc) return null;
  return {
    playerId: doc.playerId,
    gamesPlayed: doc.gamesPlayed,
    gamesWon: doc.gamesWon,
    currentStreak: doc.currentStreak,
    maxStreak: doc.maxStreak,
    lastPlayedDate: doc.lastPlayedDate,
  };
}

export async function createOrUpdatePlayerStats(playerId: string, stats: Partial<PlayerStats>) {
  const now = new Date();
  const fields: (keyof Omit<PlayerStats, "playerId">)[] = [
    "gamesPlayed", "gamesWon", "currentStreak", "maxStreak", "lastPlayedDate",
  ];

  const setObj: Record<string, unknown> = { updatedAt: now };
  const setOnInsertObj: Record<string, unknown> = { playerId, createdAt: now };

  const defaults: Record<string, unknown> = {
    gamesPlayed: 0, gamesWon: 0, currentStreak: 0, maxStreak: 0, lastPlayedDate: null,
  };

  for (const f of fields) {
    if (stats[f] !== undefined) {
      setObj[f] = stats[f];
    } else {
      setOnInsertObj[f] = defaults[f];
    }
  }

  await playersCollection.updateOne(
    { playerId },
    { $set: setObj, $setOnInsert: setOnInsertObj },
    { upsert: true }
  );
}

export async function saveGameRecord(record: GameRecord) {
  await gamesCollection.updateOne(
    { playerId: record.playerId, date: record.date },
    {
      $set: {
        solution: record.solution,
        attempts: record.attempts,
        won: record.won,
      },
      $setOnInsert: {
        playerId: record.playerId,
        date: record.date,
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );
}

export async function getGameRecord(playerId: string, date: string): Promise<GameRecord | null> {
  const doc = await gamesCollection.findOne({ playerId, date });
  if (!doc) return null;
  return {
    playerId: doc.playerId,
    date: doc.date,
    solution: doc.solution,
    attempts: doc.attempts,
    won: doc.won,
  };
}
