export function getTenantSchemaName(tenantId: string): string {
  // For now, we'll use a simple schema naming convention
  // In a real multi-tenant setup, this would be more sophisticated
  return `tenant_${tenantId.replace(/-/g, '_')}`;
}