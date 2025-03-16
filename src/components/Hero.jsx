'use client';

import React from "react";

const styles = {
  heroSection: {
    background: 'linear-gradient(to right, #4169E1, #6495ED)',
    color: '#ffffff'
  }
};

export default function Hero({ title, description, children }) {
  return (
    <section style={styles.heroSection} className="w-full py-16 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
        {description && (
          <p className="text-xl max-w-3xl mx-auto mb-4">
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}