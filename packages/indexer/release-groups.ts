import invariant from "tiny-invariant";

// db
import type { SupabaseClient } from "@subtis/db";

// constants
export const RELEASE_GROUPS = {
  AOC: {
    is_supported: true,
    release_group_name: "AOC",
    matches: ["AOC", "H264-AOC", "H265-AOC", "x264-AOC", "x265-AOC"],
  },
  AccomplishedYak: {
    is_supported: true,
    release_group_name: "AccomplishedYak",
    matches: [
      "AccomplishedYak",
      "H264-AccomplishedYak",
      "H265-AccomplishedYak",
      "x264-AccomplishedYak",
      "x265-AccomplishedYak",
    ],
  },
  CODY: {
    is_supported: true,
    release_group_name: "CODY",
    matches: ["CODY", "H265-CODY"],
  },
  EDITH: {
    is_supported: true,
    release_group_name: "EDITH",
    matches: ["EDITH", "h264-EDITH"],
  },
  ETHEL: {
    is_supported: true,
    release_group_name: "ETHEL",
    matches: ["ETHEL", "H264-ETHEL", "H265-ETHEL"],
  },
  REVILS: {
    is_supported: true,
    release_group_name: "REVILS",
    matches: ["REVILS", "h264-REVILS"],
  },
  SHITBOX: {
    is_supported: true,
    release_group_name: "SHITBOX",
    matches: ["SHITBOX", "x264-SHITBOX", "x265-SHITBOX", "0-SHITBOX", "1-SHITBOX"],
  },
  PiGNUS: {
    is_supported: true,
    release_group_name: "PiGNUS",
    matches: ["PiGNUS", "x264-pignus"],
  },
  EniaHD: {
    is_supported: true,
    release_group_name: "EniaHD",
    matches: ["EniaHD", "264-EniaHD", "265-EniaHD", "x264-EniaHD", "x265-EniaHD"],
  },
  APEX: {
    is_supported: true,
    release_group_name: "APEX",
    matches: ["APEX", "265-APEX", "264-APEX"],
  },
  FLUX: {
    is_supported: true,
    release_group_name: "FLUX",
    matches: ["FLUX", "265-Flux", "264-Flux"],
  },
  FLUX8: {
    is_supported: true,
    release_group_name: "FLUX8",
    matches: ["FLUX8"],
  },
  GalaxyRG: {
    is_supported: true,
    release_group_name: "GalaxyRG",
    matches: [
      "GalaxyRG",
      "x264-Galax",
      "x265-Galax",
      "x264-GalaxyRG",
      "x265-GalaxyRG",
      "Galaxy",
      "10bit-GalaxyRG265",
      "10bit-GalaxyRG264",
    ],
  },
  "HDRip-C1NEM4": {
    is_supported: true,
    release_group_name: "HDRip-C1NEM4",
    matches: ["HDRip-C1NEM4"],
  },
  "HEVC-CMRG": {
    is_supported: true,
    release_group_name: "HEVC-CMRG",
    matches: ["HEVC-CMRG", "CMRG", "x264-CMRG", "x265-CMRG", "H264-CMRG", "H265-CMRG", "CM", "H264-CM", "H265-CM"],
  },
  "HEVC-CM": {
    is_supported: true,
    release_group_name: "HEVC-CM",
    matches: ["HEVC-CM", "x264-CM", "x265-CM"],
  },
  "HEVC-PSA": {
    is_supported: true,
    release_group_name: "HEVC-PSA",
    matches: ["HEVC-PSA"],
  },
  "HEVC-EVO": {
    is_supported: true,
    release_group_name: "HEVC-EVO",
    matches: ["HEVC-EVO"],
  },
  ACEM: {
    is_supported: true,
    release_group_name: "ACEM",
    matches: ["ACEM", "264-ACEM", "265-ACEM"],
  },
  EVO: {
    is_supported: true,
    release_group_name: "EVO",
    matches: ["EVO", "264-EVO", "265-EVO", "x264-EVO", "x265-EVO", "264-EVO[TGx]", "265-EVO[TGx]"],
  },
  "Atmos-SWTYBLZ": {
    is_supported: true,
    release_group_name: "Atmos-SWTYBLZ",
    matches: ["Atmos-SWTYBLZ"],
  },
  "Atmos-MRCS": {
    is_supported: true,
    release_group_name: "Atmos-MRCS",
    matches: ["MRCS", "x264-MRCS"],
  },
  KBOX: {
    is_supported: true,
    release_group_name: "KBOX",
    matches: ["KBOX", "h264-kbox", "h265-kbox"],
  },
  BYNDR: {
    is_supported: true,
    release_group_name: "BYNDR",
    matches: ["H264-BYNDR", "BYNDR", "264-BYNDR"],
  },
  RABiDS: {
    is_supported: true,
    release_group_name: "RABiDS",
    matches: ["RABiDS", "H264-RABiDS"],
  },
  SLOT: {
    is_supported: true,
    release_group_name: "SLOT",
    matches: ["SLOT", "h264-slot", "h265-slot"],
  },
  KNiVES: {
    is_supported: true,
    release_group_name: "KNiVES",
    matches: ["KNiVES"],
  },
  LAMA: {
    is_supported: true,
    release_group_name: "LAMA",
    matches: ["LAMA", "x264-LAMA", "AAC-LAMA"],
  },
  LiLKiM: {
    is_supported: true,
    release_group_name: "LiLKiM",
    matches: ["LiLKiM", "h265-lilkim", "h264-lilkim"],
  },
  RiGHTNOW: {
    is_supported: true,
    release_group_name: "RiGHTNOW",
    matches: ["RiGHTNOW"],
  },
  YTS: {
    is_supported: true,
    release_group_name: "YTS",
    matches: [
      "YTS",
      "(YTS)",
      "YTS.LT",
      "YTS.AG",
      "YTS.AM",
      "YTS.MX",
      "YTS MX",
      "[YTS.MX]",
      "YIFY",
      "x264-[YTS.AM]",
      "x264-[YTS.AG]",
      "x264-[YTS.LT]",
    ],
  },
  RMTeam: {
    is_supported: true,
    release_group_name: "RMTeam",
    matches: ["x265-rmteam", "x265.rmteam", "rmteam"],
  },
  BobDobbs: {
    is_supported: true,
    release_group_name: "BobDobbs",
    matches: ["H264-BobDobbs", "BobDobbs"],
  },
  SPARKS: {
    is_supported: true,
    release_group_name: "SPARKS",
    matches: ["x264-SPARKS", "SPARKS"],
  },
  MADSKY: {
    is_supported: true,
    release_group_name: "MADSKY",
    matches: ["x264-MADSKY", "x265-MADSKY", "MADSKY", "264-MADSKY", "265-MADSKY"],
  },
  HUZZAH: {
    is_supported: true,
    release_group_name: "HUZZAH",
    matches: ["HUZZAH", "h264-huzzah", "h265-huzzah"],
  },
  ETRG: {
    is_supported: true,
    release_group_name: "ETRG",
    matches: ["ETRG", "AAC-ETRG", "x264-ETRG", "x265-ETRG"],
  },
  NTB: {
    is_supported: true,
    release_group_name: "NTB",
    matches: ["NTb", "264-NTb", "265-NTb"],
  },
  SuccessfulCrab: {
    is_supported: true,
    release_group_name: "SuccessfulCrab",
    matches: ["H264-SuccessfulCrab", "H265-SuccessfulCrab", "SuccessfulCrab", "(SuccessfulCrab)"],
  },
  TorrentGalaxy: {
    is_supported: true,
    release_group_name: "TorrentGalaxy",
    matches: ["x264-TORRENTGALAXY"],
  },
  MeGusta: {
    is_supported: true,
    release_group_name: "MeGusta",
    matches: ["x265-MeGusta", "MeGusta"],
  },
  MinX: {
    is_supported: true,
    release_group_name: "MinX",
    matches: ["x264-MinX", "x265-MinX"],
  },
  TheCuteness: {
    is_supported: true,
    release_group_name: "TheCuteness",
    matches: ["TheCuteness", "h264-thecuteness", "h265-thecuteness"],
  },
  HHWEB: {
    is_supported: true,
    release_group_name: "HHWEB",
    matches: ["HHWEB", "265-HHWEB", "264-hhweb", "aac-hhweb"],
  },
  BenTheMen: {
    is_supported: true,
    release_group_name: "BEN THE MEN",
    matches: [
      "BEN THE MEN",
      "BEN.THE.MEN,",
      "264-BEN.THE.MEN",
      "265-BEN.THE.MEN",
      "MP4-BEN.THE.MEN",
      "MKV-BEN.THE.MEN",
    ],
  },
  GODZiLLA: {
    is_supported: true,
    release_group_name: "GODZiLLA",
    matches: ["WEB-DL GODZiLLA", "264-GODZiLLA"],
  },
  POKE: {
    is_supported: true,
    release_group_name: "POKE",
    matches: ["H265-POKE", "H264-POKE", "POKE"],
  },
  NellTigerFree: {
    is_supported: true,
    release_group_name: "NellTigerFree",
    matches: ["H265-NellTigerFree"],
  },
  Xebec: {
    is_supported: true,
    release_group_name: "Xebec",
    matches: ["XEBEC", "264-XEBEC", "265-XEBEC"],
  },
  Byndr: {
    is_supported: true,
    release_group_name: "Byndr",
    matches: ["265-BYNDR", "264-BYNDR", "BYNDR", "h264-byndr", "h265-byndr"],
  },
  DualYG: {
    is_supported: true,
    release_group_name: "Dual YG",
    matches: ["Dual YG", "Dual.YG"],
  },
  playWEB: {
    is_supported: true,
    release_group_name: "playWEB",
    matches: ["DSNP playWEB”, ”playWEB", "264-playWEB”,”265-playWEB"],
  },
  LightSaber: {
    is_supported: true,
    release_group_name: "LightSaber",
    matches: ["LightSaber", "HETEL-LightSaber", "H264-lightsaber", "H265-lightsaber"],
  },
  ORGANiC: {
    is_supported: true,
    release_group_name: "ORGANiC",
    matches: ["ORGANIC", "H264-ORGANiC", "H265-ORGANiC"],
  },
  ELiTE: {
    is_supported: true,
    release_group_name: "ELiTE",
    matches: ["h264-ELiTE", "h265-ELiTE", "x264-ELiTE", "x265-ELiTE", "ELiTE"],
  },
  NHTFS: {
    is_supported: true,
    release_group_name: "NHTFS",
    matches: ["h264-NHTFS", "h265-NHTFS", "NHTFS"],
  },
  ROEN: {
    is_supported: true,
    release_group_name: "roen",
    matches: ["ROEN", "x264-ROEN", "x265-ROEN"],
  },
  Asiimov: {
    is_supported: true,
    release_group_name: "Asiimov",
    matches: ["Asiimov", "x265-Asiimov", "x264-Asiimov"],
  },
  Dolores: {
    is_supported: true,
    release_group_name: "DOLORES",
    matches: ["DOLORES", "h264-DOLORES", "h265-DOLORES"],
  },
  Will1869: {
    is_supported: true,
    release_group_name: "Will1869",
    matches: ["Will1869"],
  },
  itspee: {
    is_supported: true,
    release_group_name: "itspee",
    matches: ["itspee", "h265-itspee", "h264-itspee"],
  },
  ZoroSenpai: {
    is_supported: true,
    release_group_name: "ZoroSenpai",
    matches: ["x264-ZoroSenpai", "x265-ZoroSenpai", "ZoroSenpai"],
  },
  thismoviewillblowyouaway: {
    is_supported: true,
    release_group_name: "thismoviewillblowyouaway",
    matches: ["thismoviewillblowyouaway", "h264-thismoviewillblowyouaway", "h265-thismoviewillblowyouaway"],
  },
  privateberyloysterofdemocracy: {
    is_supported: true,
    release_group_name: "privateberyloysterofdemocracy",
    matches: [
      "privateberyloysterofdemocracy",
      "h264-privateberyloysterofdemocracy",
      "h265-privateberyloysterofdemocracy",
    ],
  },
  iseedeadpeople: {
    is_supported: true,
    release_group_name: "iseedeadpeople",
    matches: ["iseedeadpeople", "h264-iseedeadpeople", "h265-iseedeadpeople"],
  },
  RARBG: {
    is_supported: true,
    release_group_name: "RARBG",
    matches: [
      "RARBG",
      "AAC-RARBG",
      "(-MiLLENiUM)(-RARBG)",
      "(-RARBG)",
      " DTS-RARBG",
      "x264-RARBG",
      "x265-RARBG",
      "5.1-RARBG",
    ],
  },
  HEVC: {
    is_supported: true,
    release_group_name: "HEVC",
    matches: ["HEVC", "x264-HEVC", "x265-HEVC"],
  },
  DEPTH: {
    is_supported: true,
    release_group_name: "DEPT",
    matches: ["DEPT", "x264-DEPT", "x265-DEPT"],
  },
  Ozlem: {
    is_supported: true,
    release_group_name: "Ozlem",
    matches: ["Ozlem", "AAC - Ozlem"],
  },
  Tigole: {
    is_supported: true,
    release_group_name: "Tigole",
    matches: ["Tigole"],
  },
  Silence: {
    is_supported: true,
    release_group_name: "Silence",
    matches: ["Silence", "x265 Silence", "x264 Silence"],
  },
  AMIABLE: {
    is_supported: true,
    release_group_name: "AMIABLE",
    matches: ["AMIABLE", "X264-AMIABLE", "X265-AMIABLE"],
  },
  HD4U: {
    is_supported: true,
    release_group_name: "HD4U",
    matches: ["hd4u", "x264-hd4u", "x265-hd4u"],
  },
  EDGE2020: {
    is_supported: true,
    release_group_name: "EDGE2020",
    matches: ["EDGE2020", "x264-EDGE2020", "x265-EDGE2020"],
  },
  SiNNERS: {
    is_supported: true,
    release_group_name: "SiNNERS",
    matches: ["SiNNERS", "x264-SiNNERS", "x265-SiNNERS"],
  },
  FAMiLYFOREVER: {
    is_supported: true,
    release_group_name: "FAMiLYFOREVER",
    matches: ["FAMiLYFOREVER", "265-FAMiLYFOREVER", "264-FAMiLYFOREVER"],
  },
  TheBiscuitMan: {
    is_supported: true,
    release_group_name: "TheBiscuitMan",
    matches: ["TheBiscuitMan", "264-TheBiscuitMan", "265-TheBiscuitMan"],
  },
  Chivaman: {
    is_supported: true,
    release_group_name: "Chivaman",
    matches: ["Chivaman", "1-Chivaman"],
  },
  SAMPA: {
    is_supported: true,
    release_group_name: "SAMPA",
    matches: ["SAMPA", "x265 SAMPA", "x264 SAMPA"],
  },
  ViSiON: {
    is_supported: true,
    release_group_name: "ViSiON",
    matches: ["ViSiON", "x264-ViSiON", "x265-ViSiON", "AC3-ViSiON"],
  },
  REMUX: {
    is_supported: true,
    release_group_name: "REMUX",
    matches: ["REMUX"],
  },
  Grym: {
    is_supported: true,
    release_group_name: "Grym",
    matches: ["Grym", "(Short)-Grym@BTNET", "x264-Grym@BTNET", "x265-Grym@BTNET", "x264-Grym", "x265-Grym"],
  },
  NAISU: {
    is_supported: true,
    release_group_name: "NAISU",
    matches: ["NAISU", "H264-NAISU", "H265-NAISU"],
  },
  NOGRP: {
    is_supported: true,
    release_group_name: "NOGRP",
    matches: ["NOGRP", "x264-NOGRP", "x265-NOGRP", "1-NOGRP"],
  },
  ProLover: {
    is_supported: true,
    release_group_name: "ProLover",
    matches: ["ProLover", "x264 - ProLover"],
  },
  SMURF: {
    is_supported: true,
    release_group_name: "SMURF",
    matches: ["SMURF", "x264-SMURF", "x265-SMURF"],
  },
  RBG: {
    is_supported: true,
    release_group_name: "RBG",
    matches: ["RBG", "x265-RBG", "x264-RBG"],
  },
  STUTTERSHIT: {
    is_supported: true,
    release_group_name: "STUTTERSHIT",
    matches: ["STUTTERSHIT"],
  },
  FGT: {
    is_supported: true,
    release_group_name: "FGT",
    matches: ["FGT", "DTS-FGT", "5.1-FGT", "H264-FGT"],
  },
  NTG: {
    is_supported: true,
    release_group_name: "NTG",
    matches: ["NTG", "264-NTG", "x264-NTG", "x265-NTG", "H264-NTG"],
  },
  PHOENiX: {
    is_supported: true,
    release_group_name: "PHOENiX",
    matches: ["PHOENiX", "264-PHOENiX", "X264-PHOENiX", "H264-PHOENiX"],
  },
  TEPES: {
    is_supported: true,
    release_group_name: "TEPES",
    matches: ["TEPES", "264-TEPES", "X264-TEPES", "H264-TEPES", "265-TEPES"],
  },
} as const;

// types
export type ReleaseGroup = (typeof RELEASE_GROUPS)[keyof typeof RELEASE_GROUPS];

export type ReleaseGroupMap = {
  [key in ReleaseGroupNames]: ReleaseGroup & { created_at: string; id: number };
};

export type ReleaseGroupNames = (typeof RELEASE_GROUPS)[keyof typeof RELEASE_GROUPS]["release_group_name"];

export type ReleaseGroupKeys = keyof typeof RELEASE_GROUPS;

// utils
export async function saveReleaseGroupsToDb(supabaseClient: SupabaseClient): Promise<void> {
  for (const releaseGroupKey in RELEASE_GROUPS) {
    const releaseGroup = RELEASE_GROUPS[releaseGroupKey as ReleaseGroupKeys];

    const { release_group_name, matches, is_supported } = releaseGroup;

    // Check if the release group already exists in the database
    const { data: existingGroups } = await supabaseClient
      .from("ReleaseGroups")
      .select("id")
      .eq("release_group_name", release_group_name)
      .single();

    if (existingGroups) {
      await supabaseClient
        .from("ReleaseGroups")
        .update({
          is_supported,
          matches: matches as unknown as string[],
        })
        .eq("id", existingGroups.id);
    } else {
      await supabaseClient.from("ReleaseGroups").insert({
        is_supported,
        matches: matches as unknown as string[],
        release_group_name: release_group_name as unknown as string,
      });
    }
  }
}

// core
export async function getReleaseGroups(supabaseClient: SupabaseClient): Promise<ReleaseGroupMap> {
  const { data } = await supabaseClient.from("ReleaseGroups").select("*");
  invariant(data, "ReleaseGroups not found in database");

  const releaseGroups = data.reduce(
    (acc, releaseGroup) => ({ ...acc, [releaseGroup.release_group_name]: releaseGroup }),
    {},
  );

  return releaseGroups as ReleaseGroupMap;
}
