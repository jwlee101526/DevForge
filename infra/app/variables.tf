variable "subscription_id" {
  description = "Azure 구독 ID. az login 기본 구독을 쓰려면 null로 둔다."
  type        = string
  default     = null
}

variable "project_name" {
  description = "Azure 리소스 이름 접두사."
  type        = string
  default     = "devforge"
}

variable "location" {
  description = "Azure 리소스 배포 지역."
  type        = string
  default     = "koreacentral"
}

variable "environment" {
  description = "배포 환경 이름."
  type        = string
  default     = "prod"
}

variable "service_plan_sku_name" {
  description = "App Service Plan SKU."
  type        = string
  default     = "B1"
}

variable "java_version" {
  description = "Linux Web App Java 런타임 버전."
  type        = string
  default     = "25"
}

variable "package_path" {
  description = "배포할 Spring Boot 실행 JAR 경로."
  type        = string
  default     = "../../backend/build/libs/app.jar"
}

variable "app_settings" {
  description = "필요 시 추가할 App Settings."
  type        = map(string)
  default     = {}
  sensitive   = true
}

variable "tags" {
  description = "공통 Azure 태그."
  type        = map(string)
  default     = {}
}
