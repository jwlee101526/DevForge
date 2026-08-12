locals {
  normalized_project = lower(replace(var.project_name, "_", "-"))
  resource_prefix    = "${local.normalized_project}-${var.environment}"
  jar_name           = basename(var.package_path)
  agy_path           = "/home/.local/bin/agy"
  startup_command    = "java --enable-native-access=ALL-UNNAMED -cp /home/site/wwwroot org.springframework.boot.loader.launch.JarLauncher"

  default_app_settings = {
    AI_PROVIDER_DEFAULT                 = "Antigravity"
    ANTIGRAVITY_EXECUTABLE_PATH         = local.agy_path
    ANTIGRAVITY_LOG_FILE                = "/home/LogFiles/antigravity-cli.log"
    ANTIGRAVITY_SHARED_CONFIG_PATH      = "/home/.gemini/antigravity-cli/settings.json"
    XDG_CONFIG_HOME                     = "/home/.config"
    DEVFORGE_DB_PATH                    = "/home/devforge.db"
    WEBSITE_JAVA_JAR_FILE_NAME          = local.jar_name
    SERVER_PORT                         = "8080"
    WEBSITES_ENABLE_APP_SERVICE_STORAGE = "true"
    WEBSITES_PORT                       = "8080"
    SCM_DO_BUILD_DURING_DEPLOYMENT      = "false"
    ENABLE_ORYX_BUILD                   = "false"
  }

  common_tags = merge(
    {
      project     = var.project_name
      environment = var.environment
      managed_by  = "terraform"
    },
    var.tags
  )
}

resource "random_string" "suffix" {
  length  = 6
  lower   = true
  numeric = true
  special = false
  upper   = false
}

resource "azurerm_resource_group" "main" {
  name     = "rg-${local.resource_prefix}"
  location = var.location
  tags     = local.common_tags
}

resource "azurerm_service_plan" "main" {
  name                = "asp-${local.resource_prefix}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  os_type             = "Linux"
  sku_name            = var.service_plan_sku_name
  tags                = local.common_tags
}

resource "azurerm_linux_web_app" "main" {
  name                = "app-${local.resource_prefix}-${random_string.suffix.result}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  service_plan_id     = azurerm_service_plan.main.id
  https_only          = true
  zip_deploy_file     = var.package_path
  tags                = local.common_tags

  site_config {
    always_on                         = true
    ftps_state                        = "Disabled"
    health_check_eviction_time_in_min = 2
    health_check_path                 = "/api/quiz/providers"
    minimum_tls_version               = "1.2"
    scm_minimum_tls_version           = "1.2"
    use_32_bit_worker                 = false
    app_command_line                  = local.startup_command

    application_stack {
      java_server         = "JAVA"
      java_server_version = var.java_version
      java_version        = var.java_version
    }
  }

  app_settings = merge(local.default_app_settings, var.app_settings)
}
