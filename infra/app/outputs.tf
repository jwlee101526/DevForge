output "resource_group_name" {
  description = "생성된 Resource Group 이름."
  value       = azurerm_resource_group.main.name
}

output "web_app_name" {
  description = "생성된 Linux Web App 이름."
  value       = azurerm_linux_web_app.main.name
}

output "web_app_url" {
  description = "DevForge 접속 URL."
  value       = "https://${azurerm_linux_web_app.main.default_hostname}"
}

output "providers_endpoint" {
  description = "헬스 체크용 AI provider API."
  value       = "https://${azurerm_linux_web_app.main.default_hostname}/api/quiz/providers"
}

output "ssh_login_command" {
  description = "Antigravity CLI 최초 로그인을 위한 Web App SSH 명령."
  value       = "az webapp ssh --resource-group ${azurerm_resource_group.main.name} --name ${azurerm_linux_web_app.main.name}"
}
