import { createClient } from "@/lib/supabase/server";

export interface NFT {
  id?: string;
  user_privy_id: string;
  token_id?: string;
  contract_address?: string;
  blockchain?: string;
  metadata?: object;
  image_url?: string;
  name?: string;
  description?: string;
  is_minted?: boolean;
  acquired_at?: Date;
  last_transferred_at?: Date;
}

export async function createNFT(nft: NFT) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("nfts")
    .insert([nft])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create NFT: ${error.message}`);
  }

  return data;
}
export async function getNFTById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("nfts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch NFT by ID: ${error.message}`);
  }

  return data;
}
export async function getNFTsByUser(user_privy_id: string): Promise<NFT[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("nfts")
    .select("*")
    .eq("user_privy_id", user_privy_id)
    .order("acquired_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch NFTs: ${error.message}`);
  }

  return data;
}

export async function updateNFT(id: string, updates: Partial<NFT>) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("nfts")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update NFT: ${error.message}`);
  }

  return data;
}

export async function deleteNFT(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("nfts").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete NFT: ${error.message}`);
  }

  return true;
}
