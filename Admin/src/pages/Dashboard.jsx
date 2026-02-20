import { motion } from "framer-motion";

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {["Users", "Orders", "Revenue"].map((item, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-xl shadow"
        >
          <h3 className="font-semibold">{item}</h3>
          <p className="text-2xl font-bold mt-2">123</p>
        </motion.div>
      ))}
    </div>
  );
};

export default Dashboard;
