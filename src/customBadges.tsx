import { common, webpack } from "replugged";
import "./style.css";
import Badges from "./Icons";
const { React } = common;

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

export const getBadgeComponent = async (): Promise<(args: BadgeProps) => React.ReactElement> => {
  const tooltipMod = await webpack.waitForModule<Record<string, Tooltip>>(
    webpack.filters.bySource(/shouldShowTooltip:!1/),
  );

  const Tooltip =
    tooltipMod && webpack.getFunctionBySource<Tooltip>(/shouldShowTooltip:!1/, tooltipMod);
  if (!Tooltip) {
    throw new Error("Failed to find Tooltip component");
  }

  const Clickable = (await webpack
    .waitForModule(webpack.filters.bySource("renderNonInteractive"))
    .then((mod) => Object.values(mod).find((x) => x.prototype?.renderNonInteractive))) as Clickable;
  if (!Clickable) {
    throw new Error("Failed to find Clickable component");
  }

  const clickableClass = webpack.getByProps<
    "clickable" | "profileBadge",
    Record<"clickable" | "profileBadge", string>
  >("clickable", "profileBadge");
  if (!clickableClass) {
    throw new Error("Failed to find clickable class");
  }

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

  return ({ color, tooltip, tooltipPosition, className, children, gap, onClick }: BadgeProps) => {
    return (
      // eslint-disable-next-line no-undefined
      <Clickable className={clickableClass.clickable} onClick={onClick || (() => undefined)}>
        <Tooltip
          text={tooltip}
          position={tooltipPosition || "top"}
          spacing={gap === false ? 0 : 12}>
          {(props) => (
            <span {...props}>
              <div
                className={`${profileBadge22} replugged-badge ${className || ""}`}
                style={{ color: `#${color || "7289da"}` }}>
                {children}
              </div>
            </span>
          )}
        </Tooltip>
      </Clickable>
    );
  };
};

interface BadgeArgs {
  color?: string;
  url?: string;
  name?: string;
}

type Badges =
  | "bdDevs"
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
  | "gooseModTranslator";

export const getBadges = async (): Promise<
  Record<Badges, React.MemoExoticComponent<(args: BadgeArgs) => React.ReactElement>>
> => {
  const Base = await getBadgeComponent();

  const openExternal = webpack.getBySource('.target="_blank";') as (url: string) => Promise<void>;
  if (!openExternal) {
    throw new Error("Failed to find openExternal function");
  }

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

  return {
    bdDevs,
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
  };
};
