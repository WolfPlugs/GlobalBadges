import { common, components, util, webpack } from "replugged";
import "./style.css";
import Badges from "./Icons";
const { React } = common;
const { Tooltip, Clickable } = components;

export enum BadgeSizes {
  SIZE_24,
  SIZE_22,
  SIZE_18,
}

type Tooltip = React.FC<{
  text?: string;
  position?: "top" | "bottom" | "left" | "right";
  spacing?: number;
  children: (props: React.HTMLAttributes<HTMLSpanElement>) => React.ReactElement;
}>;

type Clickable = React.FC<
  Record<string, unknown> & {
    "aria-label"?: string;
    className?: string;
    children: React.ReactElement | React.ReactElement[];
    onClick?: () => void;
  }
>;

interface BadgeProps {
  color?: string;
  tooltip?: string;
  tooltipPosition?: "top" | "bottom" | "left" | "right";
  className?: string;
  children: React.ReactElement;
  gap?: boolean;
  onClick?: () => void;
}

export const Base = ({
  color,
  tooltip,
  tooltipPosition,
  className,
  children,
  gap,
  onClick,
}: BadgeProps): React.ReactElement => {
  const badgeClassMod = webpack.getByProps<
    "profileBadge22",
    {
      profileBadge22: string;
    }
  >("profileBadge22");
  if (!badgeClassMod) {
    throw new Error("Failed to find badge class");
  }
  const { profileBadge22 } = badgeClassMod;
  const child = (
    <div
      className={`${profileBadge22} replugged-badge ${className || ""}`}
      style={{ color: `#${color || "7289da"}` }}>
      {children}
    </div>
  );
  return (
    // eslint-disable-next-line no-undefined
    <Clickable onClick={onClick || (() => undefined)}>
      {tooltip ? (
        <Tooltip
          text={tooltip}
          position={tooltipPosition || "top"}
          spacing={gap === false ? 0 : 12}>
          {child}
        </Tooltip>
      ) : (
        child
      )}
    </Clickable>
  );
};

interface BadgeArgs {
  color?: string;
  url?: string;
  name?: string;
}

type Badges =
  | "bdDevs"
  | "customBadgesArray"
  | "alucordContributors"
  | "aliucordDonor"
  | "aliucordDeveloper"
  | "aliucordCustom"
  | "enmityDevs"
  | "enmityContributors"
  | "enmitySupporter"
  | "enmityStaff"
  | "enmityCustom"
  | "gooseModSponsor"
  | "gooseModDeveloper"
  | "gooseModTranslator"
  | "vencordContributor"
  | "vencordCutie"
  | "userpfp";

export const getBadges = async (): Promise<
  Record<Badges, React.MemoExoticComponent<(args: BadgeArgs) => React.ReactElement>>
> => {
  const { openExternal } = util;
  if (!openExternal) {
    throw new Error("Failed to find openExternal function");
  }

  const customBadgesArray = React.memo(({ url, name }: BadgeArgs) => (
    <Base children={<img src={url} style={{ width: "125%", height: "125%" }} />} tooltip={name} />
  ));

  const aliucordCustom = React.memo(({ url, name }: BadgeArgs) => (
    <Base children={<img src={url} style={{ width: "100%", height: "100%" }} />} tooltip={name} />
  ));

  const bdDevs = React.memo(() => (
    <Base
      children={<Badges.bdDevs />}
      tooltip={"BetterDiscord Developer"}
      onClick={() => openExternal("https://betterdiscord.app/")}
    />
  ));

  const alucordContributors = React.memo(() => (
    <Base children={<Badges.aliucordContributor />} tooltip={"Aliucord Contributor"} />
  ));

  const aliucordDonor = React.memo(() => (
    <Base
      children={
        <img
          src="https://cdn.discordapp.com/emojis/859801776232202280.webp"
          style={{ width: "100%", height: "100%" }}
        />
      }
      tooltip={"Aliucord Donor"}
    />
  ));

  const aliucordDeveloper = React.memo(() => (
    <Base children={<Badges.aliucordDeveloper />} tooltip={"Aliucord Developer"} />
  ));

  const enmityDevs = React.memo(({ url, name }: BadgeArgs) => (
    <Base children={<img src={url} style={{ width: "100%", height: "100%" }} />} tooltip={name} />
  ));

  const enmityContributors = React.memo(({ url, name }: BadgeArgs) => (
    <Base children={<img src={url} style={{ width: "100%", height: "100%" }} />} tooltip={name} />
  ));

  const enmityStaff = React.memo(({ url, name }: BadgeArgs) => (
    <Base children={<img src={url} style={{ width: "100%", height: "100%" }} />} tooltip={name} />
  ));

  const enmitySupporter = React.memo(({ url, name }: BadgeArgs) => (
    <Base children={<img src={url} style={{ width: "100%", height: "100%" }} />} tooltip={name} />
  ));

  const enmityCustom = React.memo(({ url, name }: BadgeArgs) => (
    <Base children={<img src={url} style={{ width: "100%", height: "100%" }} />} tooltip={name} />
  ));

  const gooseModSponsor = React.memo(() => (
    <Base
      children={
        <img
          src="https://goosemod.com/img/goose_globe.png"
          style={{ width: "100%", height: "100%" }}
        />
      }
      tooltip={"GooseMod Sponsor"}
    />
  ));

  const gooseModDeveloper = React.memo(() => (
    <Base
      children={
        <img
          src="https://goosemod.com/img/goose_glitch.jpg"
          style={{ width: "100%", height: "100%" }}
        />
      }
      tooltip={"GooseMod Developer"}
    />
  ));

  const gooseModTranslator = React.memo(() => (
    <Base
      children={
        <img
          src="https://goosemod.com/img/goose_globe.png"
          style={{ width: "100%", height: "100%" }}
        />
      }
      tooltip={"GooseMod Translator"}
    />
  ));

  const vencordContributor = React.memo(() => (
    <Base
      children={
        <img
          src="https://cdn.discordapp.com/attachments/1033680203433660458/1092089947126780035/favicon.png"
          style={{ width: "100%", height: "100%" }}
        />
      }
      tooltip={"Vencord Contributor"}
    />
  ));

  const vencordCutie = React.memo(({ url, name }: BadgeArgs) => (
    <Base children={<img src={url} style={{ width: "100%", height: "100%" }} />} tooltip={name} />
  ));
  
  const userpfp = React.memo(({ url, name }: BadgeArgs) => (
    <Base children={<img src={url} style={{ width: "100%", height: "100%" }} />} tooltip={name} />
  ));

  return {
    bdDevs,
    customBadgesArray,
    alucordContributors,
    aliucordDonor,
    aliucordDeveloper,
    aliucordCustom,
    enmityDevs,
    enmityContributors,
    enmityStaff,
    enmitySupporter,
    enmityCustom,
    gooseModSponsor,
    gooseModDeveloper,
    gooseModTranslator,
    vencordContributor,
    vencordCutie,
    userpfp,
  };
};
