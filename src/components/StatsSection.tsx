"use client";

import { motion } from "framer-motion";
import { Users, Award, Cpu, BookOpen, Layers, Zap } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "100+",
    label: "Active IEEE Members",
    desc: "Dedicated engineers and developers across all departments at PEC",
    color: "from-blue-600 to-cyan-500",
  },
  {
    icon: Layers,
    value: "3",
    label: "Specialized Chapters",
    desc: "Computer Society (CS), Women in Engineering (WIE), and PES",
    color: "from-indigo-600 to-blue-500",
  },
  {
    icon: Award,
    value: "1",
    label: "Outstanding SB Award",
    desc: "Honored at the IEEE Chandigarh Subsection Annual General Meeting",
    color: "from-amber-600 to-yellow-500",
  },
  {
    icon: Cpu,
    value: "15+",
    label: "Annual Events & Workshops",
    desc: "Techadroit, PECFEST Robo-Soccer, C++ & Hardware bot workshops",
    color: "from-blue-700 to-indigo-600",
  },
];

export default function StatsSection() {
  return (
    <section className="py-16 bg-white dark:bg-slate-900 border-y border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-border hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-extrabold text-[#002855] dark:text-blue-400 tracking-tight">
                    {item.value}
                  </span>
                </div>
                <h4 className="text-base font-bold text-foreground mb-1">
                  {item.label}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
