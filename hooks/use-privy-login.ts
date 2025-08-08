import { loginWithWallet } from "@/app/actions/user";
import { useLogin } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";

export const usePrivyLogin = (fromLoginPage?: boolean) => {
  const { back, push } = useRouter();
  const { address } = useAccount();

  const { login } = useLogin({
    onComplete: async ({ user, isNewUser, wasAlreadyAuthenticated }) => {
      console.log("login privy completed", user, isNewUser, address, "wagmi");
      await loginWithWallet(
        user,
        window.localStorage.getItem("privy:token") || ""
      );
      if (address) {
      }

      // if (!wasAlreadyAuthenticated) {
      //   window.location.reload();
      //   return;
      // }
    },
    onError(error) {
      console.log("login Failied", window.history.length, fromLoginPage);

      //   if (fromLoginPage) {
      //     if (window.history.length > 2) {
      //       back();
      //     } else {
      //       push("/");
      //     }
      //   }
    },
  });

  return { login };
};
