from rest_framework import permissions
from .models import CompanyUser


class IsAdminOrCompanyUser(permissions.BasePermission):
    def has_permission(self, request, view):
        is_admin = request.user and request.user.is_staff
        is_company_user = hasattr(request.user, 'companyuser')
        return bool(is_admin or is_company_user)
