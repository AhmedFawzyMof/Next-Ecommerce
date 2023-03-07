import Product from "../../models/Product";
import User from "../../models/User";
import Data from "../../utils/data";
import db from "../../utils/db";

const handler = async (req, res) => {
  await db.connect();
  await User.deleteMany();
  await User.insertMany(Data.users);
  await Product.deleteMany();
  await Product.insertMany(Data.products);
  await db.disconnect();
  res.send({ message: "seeded successfully" });
};

export default handler;
