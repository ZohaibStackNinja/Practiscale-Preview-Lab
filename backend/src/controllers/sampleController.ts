import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { Project } from "../models/Project.js";
import { Variant } from "../models/Variant.js";
import { Asset } from "../models/Asset.js";
import { ShareLink } from "../models/ShareLink.js";
import { Comment } from "../models/Comment.js";
import { hashToken } from "./shareController.js";
import crypto from "crypto";

const uploadsDir = path.resolve(process.cwd(), "uploads");

function ensureSampleAssetsExist() {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // 1. Hero banner / thumbnail SVG
  const heroSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#08202A"/>
        <stop offset="50%" stop-color="#0E3D46"/>
        <stop offset="100%" stop-color="#0ABAB5"/>
      </linearGradient>
      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#143642" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="#0F242C" stop-opacity="0.9"/>
      </linearGradient>
    </defs>
    <rect width="1280" height="720" fill="url(#bg)"/>
    <circle cx="1050" cy="200" r="280" fill="#0ABAB5" opacity="0.2"/>
    <circle cx="200" cy="600" r="320" fill="#078F8B" opacity="0.25"/>
    
    <!-- Content Card -->
    <rect x="120" y="110" width="1040" height="500" rx="24" fill="url(#cardGrad)" stroke="#0ABAB5" stroke-width="3" stroke-dasharray="6 6"/>
    
    <!-- Badge -->
    <rect x="180" y="170" width="280" height="42" rx="21" fill="#0ABAB5"/>
    <text x="320" y="197" fill="#FFFFFF" font-family="Inter, -apple-system, sans-serif" font-weight="800" font-size="16" text-anchor="middle" letter-spacing="2">ACCELERATE GROWTH</text>
    
    <!-- Title -->
    <text x="180" y="290" fill="#FFFFFF" font-family="Inter, -apple-system, sans-serif" font-weight="900" font-size="54">PractiScale Preview</text>
    <text x="180" y="360" fill="#E7F9F8" font-family="Inter, -apple-system, sans-serif" font-weight="700" font-size="38">How Strategic Referral Systems Scale</text>
    <text x="180" y="420" fill="#9AA2A4" font-family="Inter, -apple-system, sans-serif" font-weight="500" font-size="22">Proven Frameworks · High-Impact Creative · 2026 Edition</text>
    
    <!-- Visual Elements -->
    <rect x="180" y="470" width="160" height="70" rx="14" fill="#078F8B"/>
    <text x="260" y="513" fill="#FFFFFF" font-family="Inter, -apple-system, sans-serif" font-weight="700" font-size="20" text-anchor="middle">10x Scale</text>
    
    <rect x="360" y="470" width="180" height="70" rx="14" fill="#0ABAB5" opacity="0.3" stroke="#0ABAB5" stroke-width="2"/>
    <text x="450" y="513" fill="#FFFFFF" font-family="Inter, -apple-system, sans-serif" font-weight="700" font-size="20" text-anchor="middle">5 Channels</text>
    
    <!-- Right decorative illustration -->
    <g transform="translate(800, 240)">
      <rect x="0" y="40" width="60" height="180" rx="10" fill="#0ABAB5" opacity="0.8"/>
      <rect x="80" y="0" width="60" height="220" rx="10" fill="#2C9A69" opacity="0.9"/>
      <rect x="160" y="80" width="60" height="140" rx="10" fill="#078F8B" opacity="0.7"/>
      <path d="M 30 50 L 110 10 L 190 90" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>
      <circle cx="110" cy="10" r="10" fill="#FFFFFF"/>
    </g>
  </svg>`;

  // 2. Product close up SVG
  const productSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
    <rect width="1080" height="1080" fill="#141E24"/>
    <circle cx="540" cy="540" r="420" fill="#0E2F37"/>
    <circle cx="540" cy="540" r="300" fill="#0ABAB5" opacity="0.2"/>
    <rect x="290" y="290" width="500" height="500" rx="36" fill="#1E2C33" stroke="#0ABAB5" stroke-width="4"/>
    <text x="540" y="490" fill="#0ABAB5" font-family="Inter, sans-serif" font-weight="800" font-size="36" text-anchor="middle">PRODUCT CLOSE-UP</text>
    <text x="540" y="550" fill="#FFFFFF" font-family="Inter, sans-serif" font-weight="900" font-size="48" text-anchor="middle">PractiScale Engine</text>
    <text x="540" y="610" fill="#9AA2A4" font-family="Inter, sans-serif" font-weight="500" font-size="24" text-anchor="middle">Next-Gen Creative Evaluation</text>
  </svg>`;

  // 3. Team story SVG
  const teamSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
    <rect width="1080" height="1080" fill="#0D2329"/>
    <rect x="140" y="140" width="800" height="800" rx="32" fill="#163842" stroke="#2C9A69" stroke-width="4"/>
    <text x="540" y="480" fill="#2C9A69" font-family="Inter, sans-serif" font-weight="800" font-size="34" text-anchor="middle">CULTURE &amp; TEAM</text>
    <text x="540" y="550" fill="#FFFFFF" font-family="Inter, sans-serif" font-weight="900" font-size="52" text-anchor="middle">Behind The Strategy</text>
    <text x="540" y="620" fill="#E7F9F8" font-family="Inter, sans-serif" font-weight="500" font-size="24" text-anchor="middle">Building high-impact marketing assets together</text>
  </svg>`;

  fs.writeFileSync(
    path.join(uploadsDir, "sample-launch-campaign.svg"),
    heroSvg,
    "utf8",
  );
  fs.writeFileSync(
    path.join(uploadsDir, "sample-product-closeup.svg"),
    productSvg,
    "utf8",
  );
  fs.writeFileSync(
    path.join(uploadsDir, "sample-team-story.svg"),
    teamSvg,
    "utf8",
  );
}

export async function createSampleProject(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    ensureSampleAssetsExist();
    const hostUrl = `${req.protocol}://${req.get("host")}`;

    // Create Sample Project
    const project = await Project.create({
      title: "Q4 Brand Launch",
      status: "active",
    });

    // Create 3 assets & variants
    const sampleSpecs = [
      {
        name: "Launch campaign",
        filename: "sample-launch-campaign.svg",
        width: 1200,
        height: 627,
        notes:
          "Main landscape thumbnail optimized for YouTube 16:9 & LinkedIn landscape feed.",
      },
      {
        name: "Product close-up",
        filename: "sample-product-closeup.svg",
        width: 1080,
        height: 1080,
        notes: "Square variant designed for Instagram and Facebook feed posts.",
      },
      {
        name: "Team story",
        filename: "sample-team-story.svg",
        width: 1080,
        height: 1080,
        notes: "Culture & team behind-the-scenes narrative creative.",
      },
    ];

    const createdVariants = [];

    for (let i = 0; i < sampleSpecs.length; i++) {
      const spec = sampleSpecs[i];
      const asset = await Asset.create({
        projectId: project._id,
        provider: "local",
        cloudinaryPublicId: spec.filename,
        secureUrl: `${hostUrl}/uploads/${spec.filename}`,
        width: spec.width,
        height: spec.height,
        mimeType: "image/svg+xml",
        bytes: 1024 * 4,
      });

      const variant = await Variant.create({
        projectId: project._id,
        name: spec.name,
        assetId: asset._id,
        notes: spec.notes,
        width: spec.width,
        height: spec.height,
      });

      asset.variantId = variant._id as mongoose.Types.ObjectId;
      await asset.save();

      createdVariants.push({
        ...variant.toObject(),
        asset: asset.toObject(),
      });
    }

    // Set first variant as active
    project.activeVariantId = createdVariants[0]._id as mongoose.Types.ObjectId;
    await project.save();

    // Create a sample share link with 24h default using unique token
    const rawToken = `7Kx92p_${crypto.randomBytes(4).toString("hex")}`;
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const share = await ShareLink.create({
      projectId: project._id,
      variantId: createdVariants[0]._id,
      platform: "youtube",
      device: "desktop",
      tokenHash,
      rawToken,
      durationHours: 24,
      expiresAt,
    });

    // Pre-populate sample comments matching Figma node 82:6
    await Comment.create([
      {
        shareId: share._id,
        projectId: project._id,
        displayName: "Alex Morgan",
        body: "Love the crop. Can we bring the headline up slightly?",
        createdAt: new Date(Date.now() - 12 * 60 * 1000),
      },
      {
        shareId: share._id,
        projectId: project._id,
        displayName: "Jamie Lee",
        body: "The teal feels very on-brand. Approved from me.",
        createdAt: new Date(Date.now() - 34 * 60 * 1000),
      },
      {
        shareId: share._id,
        projectId: project._id,
        displayName: "Maya Chen",
        body: "I'll adjust the headline and recheck mobile.",
        createdAt: new Date(Date.now() - 2 * 60 * 1000),
      },
    ]);

    res.status(201).json({
      success: true,
      data: {
        project: {
          ...project.toObject(),
          variants: createdVariants,
          activeVariant: createdVariants[0],
        },
        sampleShareToken: rawToken,
      },
      error: null,
    });
  } catch (error) {
    next(error);
  }
}
