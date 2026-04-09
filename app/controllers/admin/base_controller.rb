module Admin
  class BaseController < ApplicationController
    before_action :authenticate_admin!

    helper_method :current_admin

    private

    def authenticate_admin!
      unless current_admin
        redirect_to admin_login_path, alert: "Please log in to continue"
      end
    end

    def current_admin
      return @current_admin if defined?(@current_admin)

      if session[:admin_id] && session[:admin_expires_at]
        if Time.current < Time.parse(session[:admin_expires_at])
          @current_admin = AdminUser.find_by(id: session[:admin_id])
        else
          session.delete(:admin_id)
          session.delete(:admin_expires_at)
          @current_admin = nil
        end
      else
        @current_admin = nil
      end
    end
  end
end
