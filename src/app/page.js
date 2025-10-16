"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Link from "next/link";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { motion } from "framer-motion";
import Typewriter from "@/utils/TypewriterText";

export default function HomePage() {
  const router = useRouter();
  const { token } = useSelector((s) => s.auth);

  useEffect(() => {
    if (token) {
      router.replace("/products");
    }
  }, [token, router]);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const features = [
    {
      title: "Fast CRUD",
      desc: "Create, read, update, and delete products with responsive feedback and cache updates.",
    },
    {
      title: "Smart Search",
      desc: "Instant search with pagination for smooth UX across large datasets.",
    },
    {
      title: "Validation & Errors",
      desc: "Inline form validation and clear network error states for reliability.",
    },
  ];

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      {/* Main */}
      <main className="flex-grow max-w-7xl mx-auto px-6 py-8 w-full">
        <div className="md:flex md:items-center md:justify-between gap-12">
          {/* Left Section  */}
          <motion.div
            className="md:w-1/2"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <Typewriter
              texts={[
                "Manage Your Products",
                "Create Amazing Inventory",
                "Track Everything Easily",
              ]}
              speed={100}
              pause={1500}
              loop={true}
              className="text-2xl md:text-4xl font-extrabold leading-tight text-[#101828]"
            />
            <motion.p
              className="mt-6 text-lg text-gray-600 max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              A product management UI using Next.js, Redux Toolkit, RTK Query,
              Tailwind CSS, and Material UI. Create, edit, browse, and delete
              products with polished UX and strong validation.
            </motion.p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products">
                <Button
                  sx={{
                    background: "linear-gradient(to right, #4f46e5, #6366f1)",
                    color: "white",
                    textTransform: "none",
                    width: "150px",
                    fontWeight: "500",
                    ":hover": {
                      background: "white",
                      border: "1px solid #6366f1",
                      color: "#6366f1",
                    },
                  }}
                >
                  Browse Products
                </Button>
              </Link>
              <Link href="/products/create">
                <Button
                  sx={{
                    background: "white",
                    color: "#6366f1",
                    border: "1px solid #6366f1",
                    textTransform: "none",
                    width: "140px",
                    fontWeight: "500",
                    ":hover": {
                      background: "#4338ca",
                      border: "1px solid #6366f1",
                      color: "white",
                    },
                  }}
                >
                  Create Product
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right Section */}
          <div className="md:w-1/2 mt-8 md:mt-0 space-y-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                whileHover={{
                  scale: 1.05,
                  y: -5,
                }}
              >
                <Card
                  elevation={3}
                  sx={{
                    p: 3,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#5A58EC",
                      boxShadow: 6,
                      "& h3, & p": { color: "white" },
                    },
                  }}
                >
                  <CardContent>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {f.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Developer notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.5 }}
          className="my-5"
        >
          <Card
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 3,
              cursor: "pointer",
              transition: "all 0.3s ease",
              position: "relative",
              overflow: "hidden",
              "&:before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "6px",
                height: "100%",
                background: "linear-gradient(to bottom, #4f46e5, #6366f1)",
              },
              "&:hover": {
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                backgroundColor: "grey.50",
              },
            }}
          >
            <CardContent>
              <h4 className="text-lg font-semibold text-gray-900">
                Developer Notes
              </h4>
              <p className="mt-2 text-sm text-gray-600">
                RTK Query caches product data automatically. Auth token is
                stored in Redux and attached to API requests. Deploy to Vercel
                for the smoothest Next.js experience.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-6">
        <div className="max-w-7xl mx-auto px-6 text-sm text-gray-500 text-center flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
          <span>
            © {new Date().getFullYear()}{" "}
            <Link
              href="/"
              className="text-gray-700 font-semibold hover:text-blue-600"
            >
              Product Management App
            </Link>{" "}
            — Built with
          </span>

          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <Link
              href="https://nextjs.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5A58EC] hover:underline"
            >
              Next.js
            </Link>
            <span>•</span>
            <Link
              href="https://tailwindcss.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5A58EC] hover:underline"
            >
              Tailwind
            </Link>
            <span>•</span>
            <Link
              href="https://mui.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5A58EC] hover:underline"
            >
              MUI
            </Link>
            <span>•</span>
            <Link
              href="https://www.framer.com/motion/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5A58EC] hover:underline"
            >
              Framer Motion
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
