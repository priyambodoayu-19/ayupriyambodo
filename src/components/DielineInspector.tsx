"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Eye, Layers } from "lucide-react";

interface DielineData {
  substrate: string;
  dimensions: string;
  bleed: string;
  creaseGuide: string;
  finishes: string[];
  colorSeparation: string[];
}

interface DielineInspectorProps {
  dielineData: DielineData;
  coverImage: string;
}

export default function DielineInspector({
  dielineData,
  coverImage,
}: DielineInspectorProps) {
  const [activeLayer, setActiveLayer] = useState<"all" | "cuts" | "creases" | "finishes">(
    "all"
  );

  return (
    <div className="space-y-6">
      {/* Spec Overview Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 rounded-xl bg-[#F4F2EC] border border-[#E5E2DA]">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#8A8881] block mb-1">
            Substrate & Weight
          </span>
          <p className="text-xs sm:text-sm font-semibold text-[#141413]">
            {dielineData.substrate}
          </p>
        </div>
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#8A8881] block mb-1">
            Flat vs Assembled
          </span>
          <p className="text-xs sm:text-sm font-semibold text-[#141413]">
            {dielineData.dimensions}
          </p>
        </div>
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#8A8881] block mb-1">
            Bleed Tolerance
          </span>
          <p className="text-xs sm:text-sm font-semibold text-[#141413]">
            {dielineData.bleed}
          </p>
        </div>
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#8A8881] block mb-1">
            Crease / Score Rule
          </span>
          <p className="text-xs sm:text-sm font-semibold text-[#141413]">
            2-Point Steel Rule
          </p>
        </div>
      </div>

      {/* Interactive Layer Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg bg-[#FAF9F5] border border-[#E5E2DA]">
        <div className="flex items-center gap-2 text-xs font-mono text-[#8A8881]">
          <Layers className="w-4 h-4 text-[#141413]" />
          <span>INSPECT PRE-PRESS LAYERS:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: "all", label: "Composite (All Layers)" },
              { id: "cuts", label: "Die Cut Lines (100% Solid)" },
              { id: "creases", label: "Crease & Fold Matrix" },
              { id: "finishes", label: "Foil & Deboss Plates" },
            ] as const
          ).map((layer) => (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                activeLayer === layer.id
                  ? "bg-[#141413] text-[#FAF9F5] font-semibold"
                  : "bg-[#EAE7DF] text-[#5A5852] hover:bg-[#DDD9CE]"
              }`}
            >
              {layer.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dieline Visual Viewport */}
      <div className="relative aspect-16/9 w-full rounded-xl overflow-hidden border border-[#E5E2DA] bg-[#FAF9F5] shadow-xs">
        <Image
          src={coverImage}
          alt="Production Dieline Blueprint"
          fill
          className={`object-contain p-4 transition-all duration-300 ${
            activeLayer === "cuts"
              ? "contrast-150"
              : activeLayer === "creases"
              ? "hue-rotate-90"
              : activeLayer === "finishes"
              ? "brightness-105 saturate-150"
              : ""
          }`}
          sizes="(max-width: 1200px) 100vw, 1200px"
        />

        {/* Live Filter Indicator Pill */}
        <div className="absolute bottom-4 left-4 z-10 px-3 py-1.5 rounded bg-[#141413]/85 text-[#FAF9F5] text-[11px] font-mono flex items-center gap-2 backdrop-blur-md">
          <Eye className="w-3.5 h-3.5 text-emerald-400" />
          <span>Active Layer View: {activeLayer.toUpperCase()}</span>
        </div>
      </div>

      {/* Production Specifications Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div className="p-6 rounded-xl bg-[#FAF9F5] border border-[#E5E2DA]">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#8A8881] mb-3 font-semibold">
            Press Finishes &amp; Embellishments
          </h4>
          <ul className="space-y-2.5">
            {dielineData.finishes.map((finish, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-xs sm:text-sm text-[#4A4843]"
              >
                <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>{finish}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 rounded-xl bg-[#FAF9F5] border border-[#E5E2DA]">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#8A8881] mb-3 font-semibold">
            Ink Separation &amp; Plate Channels
          </h4>
          <ul className="space-y-2.5">
            {dielineData.colorSeparation.map((plate, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-xs sm:text-sm text-[#4A4843]"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-[#141413] shrink-0 mt-1" />
                <span>{plate}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
