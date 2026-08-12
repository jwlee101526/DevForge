output "azure_client_id" {
  description = "GitHub Secret AZURE_CLIENT_ID에 등록할 값."
  value       = azuread_application.github_actions.client_id
}

output "azure_tenant_id" {
  description = "GitHub Secret AZURE_TENANT_ID에 등록할 값."
  value       = var.tenant_id
}

output "azure_subscription_id" {
  description = "GitHub Secret AZURE_SUBSCRIPTION_ID에 등록할 값."
  value       = var.subscription_id
}

output "tfstate_resource_group_name" {
  description = "Terraform backend resource_group_name."
  value       = azurerm_resource_group.tfstate.name
}

output "tfstate_storage_account_name" {
  description = "GitHub Secret TFSTATE_STORAGE_ACCOUNT_NAME에 등록할 값."
  value       = azurerm_storage_account.tfstate.name
}

output "tfstate_container_name" {
  description = "Terraform backend container_name."
  value       = azurerm_storage_container.tfstate.name
}
