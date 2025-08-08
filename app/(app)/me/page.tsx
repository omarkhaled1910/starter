import React from "react";
import LinkedAccountsList from "./LikedAccountsPreview";
import { usePrivy } from "@privy-io/react-auth";

const UserPage = () => {
  return (
    <div>
      <LinkedAccountsList />
    </div>
  );
};

export default UserPage;
