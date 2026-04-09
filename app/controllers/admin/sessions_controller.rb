module Admin
  class SessionsController < ApplicationController
    def new
      if current_admin
        redirect_to admin_root_path
        return
      end

      render inertia: "Admin/Login", props: {
        error: flash[:alert]
      }
    end

    def create
      admin = AdminUser.find_by(email: params[:email]&.downcase)

      if admin&.authenticate(params[:password])
        session[:admin_id] = admin.id
        session[:admin_expires_at] = 12.months.from_now.to_s

        redirect_to admin_root_path, notice: "Welcome back!"
      else
        redirect_to admin_login_path, alert: "Invalid email or password"
      end
    end

    def destroy
      session.delete(:admin_id)
      session.delete(:admin_expires_at)

      redirect_to admin_login_path, notice: "Logged out successfully"
    end

    private

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
