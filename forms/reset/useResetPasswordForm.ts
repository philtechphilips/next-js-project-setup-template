import { useForm } from "@/utils/hooks/useForm";
import { UserAPI } from "@/http/hraas-api/auth/auth.types";
import * as yup from "yup";
import { toast } from "react-toastify";
import { ResetPassword } from "@/http/hraas-api/auth/auth.index";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function useResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const form = useForm({
    initialFormData: {
      new_password: "",
      confirmPassword: "",
    },

    validationSchema: yup.object().shape({
      new_password: yup.string().required("This field is required"),
      confirmPassword: yup.string().required("This field is required"),
    }),

    async onSubmit(formData) {
      try {
        if (formData.confirmPassword !== formData.new_password) {
          toast.error("Password mismatch");
          return;
        }
        setIsLoading(true);
        const { data, error } = await ResetPassword({
          new_password: formData.new_password,
          token: params.token,
        });
        if (data) {
          toast.success(data.message || "Login Successfully!");
          router.push("/auth/sign-in");
        } else if (error) {
          toast.error(error.message || "An error occurred");
          setIsLoading(false);
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
      }
    },
  });

  return {
    ...form,
    isLoading,
  };
}
