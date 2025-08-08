"use client";

import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { useForm, useStore } from "@tanstack/react-form";
import FormField from "@/components/form/FormField";
import { GLTFExporter } from "three-stdlib";
import { upload3D } from "@/app/actions/upload-3d";
import MintButton from "./MintButton";

const shapes = ["cube", "sphere", "torus"];

type MeshComponentProps = {
  shape: string;
  color: string;
  size: number;
  rotation: { x: number; y: number; z: number };
};

const MeshComponent = forwardRef<THREE.Mesh, MeshComponentProps>(
  ({ shape, color, size, rotation }, ref) => {
    const meshRef = useRef<THREE.Mesh>(null!);

    useFrame(() => {
      if (meshRef.current) {
        meshRef.current.rotation.x = rotation.x;
        meshRef.current.rotation.y = rotation.y;
        meshRef.current.rotation.z = rotation.z;
      }
    });

    useImperativeHandle(ref, () => meshRef.current);

    const geometry = React.useMemo(() => {
      switch (shape) {
        case "sphere":
          return new THREE.SphereGeometry(1, 32, 32);
        case "torus":
          return new THREE.TorusGeometry(1, 0.4, 16, 100);
        case "cube":
        default:
          return new THREE.BoxGeometry(1.5, 1.5, 1.5);
      }
    }, [shape]);

    return (
      <mesh ref={meshRef} geometry={geometry} scale={[size, size, size]}>
        <meshStandardMaterial color={color} />
      </mesh>
    );
  }
);

export default function Art3D() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<{ url: string } | null>(null);
  const form = useForm({
    defaultValues: {
      shape: "cube",
      color: "#1e90ff",
      size: 1,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
    },
    onSubmit: async ({ value }) => {
      const exporter = new GLTFExporter();
      console.log("Form submitted with values:", value, exporter);
      setIsUploading(true);
      exporter.parse(
        meshRef.current,
        async (result) => {
          const blob =
            result instanceof ArrayBuffer
              ? new Blob([result], { type: "model/gltf-binary" })
              : new Blob([JSON.stringify(result)], {
                  type: "application/json",
                });

          const file = new File([blob], "model.glb", {
            type: "model/gltf-binary",
          });
          console.log(file, "file");
          const res = await upload3D(file);
          console.log(res, "after export  ad upload");
          setIsUploading(false);
          setResult({ url: res.url });
        },
        (error) => {
          console.error(error);
          setIsUploading(false);
        },
        { binary: true }
      );
    },
  });

  const shapeField = {
    name: "shape",
    label: "Shape",
    type: "select" as const,
    placeholder: "Select a shape",
    options: shapes.map((s) => ({
      label: s.charAt(0).toUpperCase() + s.slice(1),
      value: s,
    })),
  };

  const colorField = {
    name: "color",
    label: "Color",
    type: "color" as const,
    placeholder: "#1e90ff",
  };

  const sizeField = {
    name: "size",
    label: "Size",
    type: "slider" as const,
    min: 0.1,
    max: 3,
    step: 0.1,
  };

  const rotationXField = {
    name: "rotationX",
    label: "Rotation X",
    type: "slider" as const,
    min: 0,
    max: Math.PI * 2,
    step: 0.1,
  };

  const rotationYField = {
    name: "rotationY",
    label: "Rotation Y",
    type: "slider" as const,
    min: 0,
    max: Math.PI * 2,
    step: 0.1,
  };

  const rotationZField = {
    name: "rotationZ",
    label: "Rotation Z",
    type: "slider" as const,
    min: 0,
    max: Math.PI * 2,
    step: 0.1,
  };

  const formValues = useStore(form.store, (state) => state.values);

  return (
    <div className="max-w-6xl mx-auto p-6 pt-0">
      <MintButton url={result?.url || ""} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="border rounded-lg p-6 bg-card">
          <h2 className="text-xl font-semibold mb-4">3D Art Configuration</h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <FormField fieldConfig={shapeField} form={form} />
              <FormField fieldConfig={colorField} form={form} />
              <FormField fieldConfig={sizeField} form={form} />

              <h3 className="text-lg font-medium">Rotation Settings</h3>
              <FormField fieldConfig={rotationXField} form={form} />
              <FormField fieldConfig={rotationYField} form={form} />
              <FormField fieldConfig={rotationZField} form={form} />
            </div>

            <div className="flex justify-center w-full">
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button
                    className="w-full"
                    type="submit"
                    disabled={!canSubmit}
                  >
                    {isSubmitting || isUploading
                      ? "Updating..."
                      : "Update 3D Model"}
                  </Button>
                )}
              />
            </div>
          </form>
        </div>

        <div className="border rounded-lg p-6 bg-card">
          <h2 className="text-xl font-semibold mb-4">3D Preview</h2>

          <div className="aspect-square">
            <Canvas>
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
              <pointLight position={[-10, -10, -10]} />
              <MeshComponent
                ref={meshRef}
                shape={formValues.shape}
                color={formValues.color}
                size={formValues.size}
                rotation={{
                  x: formValues.rotationX,
                  y: formValues.rotationY,
                  z: formValues.rotationZ,
                }}
              />
              <OrbitControls />
            </Canvas>
          </div>

          <div className="mt-6">
            <h3 className="font-medium mb-2">How it works</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Adjust the parameters to customize your 3D model</li>
              <li>• Real-time preview updates as you change settings</li>
              <li>• Use your mouse to rotate the view</li>
              <li>• Scroll to zoom in/out</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
