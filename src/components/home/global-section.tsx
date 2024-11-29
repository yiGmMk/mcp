'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Globe } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const languages = [
  { code: 'en', name: 'English', continent: 'Global' },
  { code: 'zh', name: '中文', continent: 'Asia' },
//   { code: 'ja', name: '日本語', continent: 'Asia' },
];

const continents = [
  { name: 'North America', x: '20%', y: '35%' },
  { name: 'South America', x: '30%', y: '65%' },
  { name: 'Europe', x: '45%', y: '30%' },
  { name: 'Africa', x: '45%', y: '55%' },
  { name: 'Asia', x: '70%', y: '40%' },
  { name: 'Oceania', x: '80%', y: '70%' },
];

export function GlobalSection() {
  const t = useTranslations('Index');

  return (
    <motion.section 
      className="py-32 px-6 relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 animated-gradient opacity-50" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        
        {/* 动态连接线 */}
        {continents.map((continent, index) => (
          <motion.div
            key={continent.name}
            className="absolute w-2 h-2 rounded-full bg-primary"
            style={{
              left: continent.x,
              top: continent.y,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.2,
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div 
          className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Globe className="h-10 w-10 text-primary" />
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.h2 
            className="mt-8 text-4xl font-bold gradient-text"
            variants={item}
          >
            {t('global.title')}
          </motion.h2>
          <motion.p 
            className="mt-6 text-lg text-muted-foreground [text-wrap:balance] leading-relaxed"
            variants={item}
          >
            {t('global.description')}
          </motion.p>

          <motion.div 
            className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {languages.map((lang, index) => (
              <motion.div
                key={lang.code}
                variants={item}
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <motion.div 
                  className="relative glass-effect rounded-xl p-6 border border-primary/10"
                  initial={false}
                  whileHover={{
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                >
                  <motion.div 
                    className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.3,
                    }}
                  >
                    <span className="text-xl">{lang.code === 'en' ? '🌍' : lang.code === 'zh' ? '🇨🇳' : '🇯🇵'}</span>
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2">
                    {t(`global.languages.${lang.code}`)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {lang.name}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="mt-16 flex flex-wrap justify-center gap-4"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {['community', 'documentation', 'support'].map((key) => (
              <motion.div 
                key={key}
                variants={item}
                whileHover={{ scale: 1.05 }}
                className="px-6 py-3 rounded-full glass-effect hover-card text-primary font-medium"
              >
                {t(`global.features.${key}`)}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
} 