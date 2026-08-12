variable "subscription_id" {
  description = "Azure 구독 ID."
  type        = string
}

variable "tenant_id" {
  description = "Microsoft Entra tenant ID."
  type        = string
}

variable "location" {
  description = "Bootstrap 리소스 배포 지역."
  type        = string
  default     = "koreacentral"
}

variable "tfstate_resource_group_name" {
  description = "Terraform state Storage Account가 위치할 Resource Group 이름."
  type        = string
  default     = "rg-devforge-tfstate"
}

variable "tfstate_storage_account_name" {
  description = "Terraform state Storage Account 이름. Azure 전역에서 고유해야 한다."
  type        = string
}

variable "tfstate_container_name" {
  description = "Terraform state Blob Container 이름."
  type        = string
  default     = "tfstate"
}

variable "github_repository" {
  description = "GitHub 저장소. owner/name 형식."
  type        = string
  default     = "jwlee101526/DevForge"
}

variable "github_repository_immutable" {
  description = "GitHub OIDC가 owner/repository ID를 포함해 발급하는 저장소 subject 식별자."
  type        = string
  default     = "jwlee101526@283841749/DevForge@1331518967"
}

variable "deploy_branch" {
  description = "배포 workflow가 실행되는 브랜치."
  type        = string
  default     = "deploy"
}

variable "github_actions_app_name" {
  description = "GitHub Actions용 Microsoft Entra App Registration 이름."
  type        = string
  default     = "devforge-github-actions"
}

variable "tags" {
  description = "Bootstrap 리소스 공통 태그."
  type        = map(string)
  default = {
    project     = "devforge"
    environment = "bootstrap"
    managed_by  = "terraform"
  }
}
