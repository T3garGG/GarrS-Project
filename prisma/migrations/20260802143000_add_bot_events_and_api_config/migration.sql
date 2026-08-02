-- AlterTable: AppSettings
ALTER TABLE "AppSettings" ADD COLUMN "tiktokApiUrl" TEXT;
ALTER TABLE "AppSettings" ADD COLUMN "instagramApiUrl" TEXT;
ALTER TABLE "AppSettings" ADD COLUMN "youtubeApiUrl" TEXT;

-- AlterTable: BotConnection
ALTER TABLE "BotConnection" ADD COLUMN "botInfo" TEXT;

-- CreateTable: BotEvent
CREATE TABLE "BotEvent" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT ('uuid_generate_v4()'),
  "botId" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "payload" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "BotEvent_botId_fkey" FOREIGN KEY ("botId") REFERENCES "BotConnection" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex: BotEvent
CREATE INDEX "BotEvent_botId_idx" ON "BotEvent" ("botId");
