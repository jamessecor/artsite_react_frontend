import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default () => {
    return defineConfig({
        server: {
            port: 3000,
        },
        plugins: [react()],
        css: {
            postcss: {
                plugins: [
                    {
                        postcssPlugin: 'internal:charset-removal',
                        AtRule: {
                            charset: (atRule) => {
                                if (atRule.name === 'charset') {
                                    atRule.remove();
                                }
                            }
                        }
                    }
                ]
            }
        }
    });
};