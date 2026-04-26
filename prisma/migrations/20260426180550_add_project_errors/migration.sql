-- CreateTable
CREATE TABLE "project_errors" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "stack" TEXT,
    "page" TEXT,
    "severity" TEXT NOT NULL DEFAULT 'medium',
    "status" TEXT NOT NULL DEFAULT 'new',
    "sessionId" TEXT,
    "userAgent" TEXT,
    "deviceType" TEXT,
    "deviceName" TEXT,
    "browser" TEXT,
    "count" INTEGER NOT NULL DEFAULT 1,
    "fingerprint" TEXT,
    "metadata" TEXT NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_errors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "project_errors_projectId_idx" ON "project_errors"("projectId");

-- CreateIndex
CREATE INDEX "project_errors_severity_idx" ON "project_errors"("severity");

-- CreateIndex
CREATE INDEX "project_errors_status_idx" ON "project_errors"("status");

-- CreateIndex
CREATE INDEX "project_errors_createdAt_idx" ON "project_errors"("createdAt");

-- CreateIndex
CREATE INDEX "project_errors_fingerprint_idx" ON "project_errors"("fingerprint");

-- AddForeignKey
ALTER TABLE "project_errors" ADD CONSTRAINT "project_errors_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
