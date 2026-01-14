'use client';

import React, { useState } from 'react';

const faqs = [
    {
        id: 1,
        question: 'Çilingir çağırmak güvenli mi?',
        answer: 'Evet, güvenilir ve sertifikalı çilingirlerle çalışırsanız güvenlidir. Bi Çilingir platformundaki tüm çilingirler doğrulanmış ve güvenilirdir. Çilingirler kimlik kontrolü yapmalı ve ev sahibi olduğunuzu doğrulamalıdır.'
    },
    {
        id: 2,
        question: 'Kapıya zarar verir mi?',
        answer: 'Profesyonel çilingirler özel aletler kullanarak kapıyı hasarsız açabilir. Ancak kapıyı zorlamak veya kırmaya çalışmak ciddi hasarlara yol açabilir. Bu yüzden profesyonel çilingir çağırmak önemlidir.'
    },
    {
        id: 3,
        question: 'Kimlik ister mi?',
        answer: 'Evet, güvenlik nedeniyle çilingirler kimlik ve ev sahibi olduğunuzu gösteren belgeler (tapu, kira sözleşmesi, fatura vb.) isteyebilir. Bu standart bir güvenlik prosedürüdür.'
    },
    {
        id: 4,
        question: 'Gece fiyat farkı olur mu?',
        answer: 'Evet, gece saatlerinde (genellikle 22:00-06:00 arası) çilingir hizmetleri için ek ücret alınabilir. Bu normal bir uygulamadır çünkü gece hizmeti daha zorlu ve acil durumlarda verilir.'
    }
];

export default function FAQSection() {
    const [openId, setOpenId] = useState(null);

    const toggleFAQ = (id) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <div className="space-y-4">
            {faqs.map((faq) => (
                <article
                    key={faq.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                    <button
                        onClick={() => toggleFAQ(faq.id)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                        <h3 className="font-semibold text-gray-900 pr-4">{faq.question}</h3>
                        <span className="text-2xl text-gray-400 flex-shrink-0">
                            {openId === faq.id ? '−' : '+'}
                        </span>
                    </button>
                    {openId === faq.id && (
                        <div className="px-6 py-4 border-t border-gray-100">
                            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </div>
                    )}
                </article>
            ))}
        </div>
    );
}
