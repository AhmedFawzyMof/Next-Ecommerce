import { getSession } from "next-auth/react";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send("signin required");
  }
  res.send(
    process.env.PAYPAL_CLIENT_ID ||
      "AVyLyDJlOaHENRf_S5tqWP16v4gWSUF2i22hnaN2Cd9cST4VkBSkzgeXxM55MX1WJRNMLAyU4HTTki8S"
  );
};
export default handler;
