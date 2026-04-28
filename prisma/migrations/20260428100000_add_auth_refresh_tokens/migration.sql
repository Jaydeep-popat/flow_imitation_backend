-- CreateTable
CREATE TABLE "auth_refresh_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "revokedReason" TEXT,
    "replacedByTokenId" TEXT,

    CONSTRAINT "auth_refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "auth_refresh_tokens_tokenHash_key" ON "auth_refresh_tokens"("tokenHash");

-- CreateIndex
CREATE INDEX "auth_refresh_tokens_userId_idx" ON "auth_refresh_tokens"("userId");

-- CreateIndex
CREATE INDEX "auth_refresh_tokens_sessionId_idx" ON "auth_refresh_tokens"("sessionId");

-- CreateIndex
CREATE INDEX "auth_refresh_tokens_expiresAt_idx" ON "auth_refresh_tokens"("expiresAt");

-- AddForeignKey
ALTER TABLE "auth_refresh_tokens" ADD CONSTRAINT "auth_refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
