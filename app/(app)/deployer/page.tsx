"use client";

import React, { useState, useTransition, useEffect } from "react";
import { usePrivy, useWallets, useActiveWallet } from "@privy-io/react-auth";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowBigLeft,
  Copy,
  ExternalLink,
  Shield,
  Zap,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import FormField from "@/components/form/FormField";

import {
  deployContract,
  estimateDeploymentCosts,
  getDeploymentHistory,
} from "@/app/actions/contract-deployment";
import {
  detectBlockchainFromPrivy,
  generateSystemImageUrl,
  formatAddress,
  getBlockchainDisplayName,
  BLOCKCHAIN_CONFIGS,
} from "@/utils/blockchain-helpers";
import {
  DeploymentForm,
  DeploymentResult,
  SupportedBlockchain,
  DeploymentStatus,
} from "@/types/deployment";
import { supportedChains } from "@/constants";

const DeployerPage = () => {
  const router = useRouter();
  const { user, authenticated } = usePrivy();

  const [result, setResult] = useState<DeploymentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [detectedNetwork, setDetectedNetwork] =
    useState<SupportedBlockchain | null>(null);
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus>({
    step: "idle",
    message: "Ready to deploy",
    progress: 0,
  });
  const [costs, setCosts] = useState<{
    gasEstimate: string;
    costEstimate: string;
    currency: string;
  } | null>(null);
  const [deploymentHistory, setDeploymentHistory] = useState<any[]>([]);
  const { wallets } = useWallets();
  const { network, wallet } = useActiveWallet();
  console.log(network, wallet);
  //   const chainId = await walletClient.getChainId();

  //   console.log(walletClient, walletClient.data);
  // Detect network from Privy connection
  useEffect(() => {
    if (authenticated && user?.wallet) {
      const detection = detectBlockchainFromPrivy(user.wallet);
      if (detection) {
        setDetectedNetwork(detection.blockchain);
        // Load cost estimates for detected network
        estimateDeploymentCosts(detection.blockchain).then(setCosts);
      }
    }
  }, [authenticated, user]);

  // Load deployment history
  useEffect(() => {
    if (authenticated && user?.id) {
      getDeploymentHistory(user.id).then(setDeploymentHistory);
    }
  }, [authenticated, user, result]);

  const form = useForm({
    defaultValues: {
      privateKey: "",
      name: "",
      description: "",
    },
    onSubmit: async ({ value }) => {
      //   const chainId = await walletClient?.getChainId();
      //   console.log(chainId);
      const chainIdStr = wallets[0].chainId; // "eip155:137"
      if (!supportedChains.includes(chainIdStr)) {
        // await wallet?.unlink();
        toast.error(
          "Unsupported blockchain network please select Optimism, Sepolia, Ethereum, zkSync or Solana  "
        );
        return;
      }
      if (!authenticated || !user?.id) {
        toast.error("Please connect your wallet first");
        return;
      }

      if (!detectedNetwork) {
        toast.error("Unable to detect blockchain network");
        return;
      }

      startTransition(async () => {
        try {
          setError(null);
          setResult(null);

          // Generate system image URL
          const imageUrl = generateSystemImageUrl(value.name, detectedNetwork);

          // Update deployment status
          setDeploymentStatus({
            step: "validating",
            message: "Validating deployment parameters...",
            progress: 10,
          });

          await new Promise((resolve) => setTimeout(resolve, 1000));

          setDeploymentStatus({
            step: "generating-image",
            message: "Generating system image URL...",
            progress: 25,
          });

          await new Promise((resolve) => setTimeout(resolve, 1000));

          setDeploymentStatus({
            step: "compiling",
            message: "Compiling contract bytecode...",
            progress: 50,
          });

          await new Promise((resolve) => setTimeout(resolve, 1500));

          setDeploymentStatus({
            step: "deploying",
            message: `Deploying to ${getBlockchainDisplayName(
              detectedNetwork
            )}...`,
            progress: 75,
          });

          const deploymentResult = await deployContract({
            ...value,
            blockchain: detectedNetwork,
            userPrivyId: user.id,
          });

          if (deploymentResult.success) {
            setDeploymentStatus({
              step: "completed",
              message: "Contract deployed successfully!",
              progress: 100,
            });
            setResult(deploymentResult);
            toast.success("Smart contract deployed successfully!");

            // Update form with generated image URL
          } else {
            throw new Error(deploymentResult.error || "Deployment failed");
          }
        } catch (err) {
          console.error("Deployment error:", err);
          const errorMessage =
            err instanceof Error ? err.message : "Failed to deploy contract";
          setError(errorMessage);
          setDeploymentStatus({
            step: "error",
            message: errorMessage,
            progress: 0,
          });
          toast.error(errorMessage);
        }
      });
    },
  });

  // Field configurations
  const privateKeyField = {
    name: "privateKey" as const,
    label: "Private Key",
    type: "password" as const,
    placeholder: "Enter your private key (keep this secure)",
    validators: {
      onChange: ({ value }: { value: string }) => {
        if (!value) return "Private key is required";
        if (value.length < 10)
          return "Private key must be at least 10 characters";
        return undefined;
      },
    },
  };

  const nameField = {
    name: "name" as const,
    label: "Contract Name",
    type: "text" as const,
    placeholder: "Enter NFT collection name",
    validators: {
      onChange: ({ value }: { value: string }) => {
        if (!value) return "Contract name is required";
        if (value.length < 3) return "Name must be at least 3 characters";
        if (value.length > 50) return "Name must be less than 50 characters";
        return undefined;
      },
    },
  };

  const descriptionField = {
    name: "description" as const,
    label: "Description",
    type: "textarea" as const,
    placeholder: "Describe your NFT collection (10-500 characters)",
    validators: {
      onChange: ({ value }: { value: string }) => {
        if (!value) return "Description is required";
        if (value.length < 10)
          return "Description must be at least 10 characters";
        if (value.length > 500)
          return "Description must be less than 500 characters";
        return undefined;
      },
    },
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 pt-0">
      {/* Header */}
      <header className="flex items-center justify-between gap-2 mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowBigLeft />
          </Button>
          <h1 className="text-2xl font-bold">Smart Contract Deployer</h1>
        </div>
        {detectedNetwork && (
          <Badge variant="secondary" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            {getBlockchainDisplayName(detectedNetwork)}
          </Badge>
        )}
      </header>

      {/* Connection Warning */}
      {!authenticated && (
        <Alert className="mb-6">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Please connect your wallet to deploy smart contracts.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Deployment Configuration</CardTitle>
            <CardDescription>
              Configure your ERC-721 smart contract deployment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-6"
            >
              <FormField fieldConfig={privateKeyField} form={form} />
              <FormField fieldConfig={nameField} form={form} />
              <FormField fieldConfig={descriptionField} form={form} />

              {/* Network & Cost Information */}
              {detectedNetwork && costs && (
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium">Deployment Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Network:</span>
                      <p className="font-medium">
                        {getBlockchainDisplayName(detectedNetwork)}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Estimated Cost:
                      </span>
                      <p className="font-medium">
                        {costs.costEstimate} {costs.currency}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Deployment Progress */}
              {(isPending || deploymentStatus.step !== "idle") && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>{deploymentStatus.message}</span>
                    <span>{deploymentStatus.progress}%</span>
                  </div>
                  <Progress value={deploymentStatus.progress} className="h-2" />
                </div>
              )}

              {/* Submit Button */}
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button
                    className="w-full"
                    type="submit"
                    disabled={!canSubmit || !authenticated || isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Deploying...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Deploy Contract
                      </>
                    )}
                  </Button>
                )}
              />
            </form>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Deployment Results</CardTitle>
            <CardDescription>
              Contract deployment status and information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Success Results */}
            {result && result.success && (
              <div className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Contract deployed successfully to{" "}
                    {getBlockchainDisplayName(detectedNetwork!)}
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  {/* Contract Address */}
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                    <div>
                      <p className="text-sm font-medium">Contract Address</p>
                      <p className="text-xs text-muted-foreground">
                        {formatAddress(result.contractAddress!)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          copyToClipboard(
                            result.contractAddress!,
                            "Contract address"
                          )
                        }
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      {result.explorerUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            window.open(result.explorerUrl, "_blank")
                          }
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Transaction Hash */}
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                    <div>
                      <p className="text-sm font-medium">Transaction Hash</p>
                      <p className="text-xs text-muted-foreground">
                        {formatAddress(result.transactionHash!)}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        copyToClipboard(
                          result.transactionHash!,
                          "Transaction hash"
                        )
                      }
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* Deployment Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/50 rounded-md">
                      <p className="text-sm font-medium">Gas Used</p>
                      <p className="text-xs text-muted-foreground">
                        {result.gasUsed}
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-md">
                      <p className="text-sm font-medium">Total Cost</p>
                      <p className="text-xs text-muted-foreground">
                        {result.deploymentCost}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Placeholder when no results */}
            {!result && !error && deploymentStatus.step === "idle" && (
              <div className="flex items-center justify-center h-48 bg-muted/20 rounded-md">
                <div className="text-center p-4">
                  <div className="mx-auto bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 dark:bg-gray-700 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Deployment results will appear here
                  </p>
                </div>
              </div>
            )}

            {/* How it works */}
            <div className="pt-4">
              <Separator className="mb-4" />
              <h3 className="font-medium mb-2">How it works</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Auto-detects blockchain from your connected wallet</li>
                <li>• Validates deployment parameters and private key</li>
                <li>• Compiles and deploys ERC-721 contract</li>
                <li>• Saves deployment record to your profile</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deployment History */}
      {deploymentHistory.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Deployment History</CardTitle>
            <CardDescription>
              Your previous contract deployments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {deploymentHistory.map((deployment) => (
                <div
                  key={deployment.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
                >
                  <div>
                    <p className="font-medium">{deployment.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {deployment.blockchain} •{" "}
                      {new Date(deployment.minted_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {deployment.contract_address && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          copyToClipboard(
                            deployment.contract_address,
                            "Contract address"
                          )
                        }
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DeployerPage;
