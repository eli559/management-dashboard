-- CreateTable
CREATE TABLE "access_credentials" (
    "id" TEXT NOT NULL,
    "projectId" TEXT,
    "type" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "loginUrl" TEXT,
    "username" TEXT,
    "encryptedSecret" TEXT NOT NULL,
    "notes" TEXT,
    "createdBy" TEXT,
    "lastViewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "access_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credential_audit_logs" (
    "id" TEXT NOT NULL,
    "credentialId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "userId" TEXT,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credential_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "access_credentials_projectId_idx" ON "access_credentials"("projectId");

-- CreateIndex
CREATE INDEX "access_credentials_type_idx" ON "access_credentials"("type");

-- CreateIndex
CREATE INDEX "credential_audit_logs_credentialId_idx" ON "credential_audit_logs"("credentialId");

-- CreateIndex
CREATE INDEX "credential_audit_logs_createdAt_idx" ON "credential_audit_logs"("createdAt");

-- AddForeignKey
ALTER TABLE "credential_audit_logs" ADD CONSTRAINT "credential_audit_logs_credentialId_fkey" FOREIGN KEY ("credentialId") REFERENCES "access_credentials"("id") ON DELETE CASCADE ON UPDATE CASCADE;
