"use server";
import { createClient } from "@/lib/supabase/server";

export type NFTType = "BASH" | "ART" | "3D" | "CUSTOM";
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
  type?: NFTType;
  owner_address?: string;
  minted_at?: Date;
  minted_by?: string;
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

export async function getAllNFTsCount() {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("nfts")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error getting NFTs count:", error);
    return 0;
  }

  return count || 0;
}

export async function getAllNFTs(
  pageParam: number,
  limit: number,
  searchTerm?: string,
  status?: string
) {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("nfts")
      .select("*")
      .range(pageParam, pageParam + limit - 1);

    // Add filters if provided
    if (searchTerm) {
      query = query.ilike("name", `%${searchTerm}%`);
    }

    // if (status) {
    //   query = query.eq("status", status);
    // }

    const { data, error } = await query;
    console.log(data);

    if (error) {
      console.error(error);
      return [];
    }
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function mintNFT(nft: NFT) {
  const supabase = await createClient();
  if (!nft.id) {
    const { data, error } = await supabase
      .from("nfts")
      .insert([{ ...nft, is_minted: true, minted_at: new Date() }])
      .select()
      .single();

    return data;
  }
  const { data, error } = await supabase
    .from("nfts")
    .update({
      is_minted: true,
      blockchain: nft.blockchain,
      owner_address: nft.owner_address,
      minted_at: new Date(),
      minted_by: nft.minted_by,
      // depend on block chain
      contract_address: "",
    })
    .eq("id", nft.id);

  if (error) {
    throw new Error(`Failed to mint NFT: ${error.message}`);
  }
  return data;
}
