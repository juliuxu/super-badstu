import { FormattedTimeAndPlace, formattedTimeAndPlace } from "~/utils";
import type { OrderInfo } from "../../schema/order-info.server";
import type { Share } from "~/schema/share.server";

type YouHaveBeenInvitedMessageProps = Omit<Share, "relativeDate">;
export function YouHaveBeenInvitedMessage(
  props: YouHaveBeenInvitedMessageProps
) {
  return (
    <>
      🎉 Du har blitt invitert med i badstuen{" "}
      <FormattedTimeAndPlace {...props} />. Bli med da vell 🧖
    </>
  );
}

export const buildShareLinkAndData = ({
  password,
  date,
  time,
  sted,
}: OrderInfo) => {
  const shareLink = `/?${new URLSearchParams({
    password,
    sted,
    time,
    share: "true",
  })}`;

  const shareData = {
    title: `Badstu ${sted}`,
    text: `Bli med i badstuen ${formattedTimeAndPlace({ date, time, sted })}`,
    url: shareLink,
  };

  return { shareLink, shareData };
};