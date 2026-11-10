/* Movimiento decorativo: partículas de fondo, escalera de progreso y ondas del pie.
   Sin dependencias. Respeta prefers-reduced-motion y pausa al ocultar la pestaña. */
(function () {
    "use strict";

    var root = document.documentElement;
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var scenes = [];
    var rafId = 0;
    var lastTime = 0;

    function themeColors() {
        var styles = getComputedStyle(root);
        function token(name, fallback) {
            var value = (styles.getPropertyValue(name) || "").trim();
            return value || fallback;
        }
        return {
            ink: token("--ink", "#f4f3ea"),
            line: token("--line", "#262932"),
            accent: token("--accent-2", "#cbb6ff"),
            accentText: token("--accent-2-text", "#4a2f8f")
        };
    }

    function hexToRgba(color, alpha) {
        var hex = String(color).trim().replace("#", "");
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        var value = parseInt(hex, 16);
        if (hex.length !== 6 || isNaN(value)) {
            return "rgba(130, 130, 140, " + alpha + ")";
        }
        return "rgba(" + ((value >> 16) & 255) + ", " + ((value >> 8) & 255) + ", " + (value & 255) + ", " + alpha + ")";
    }

    function prepare(canvas) {
        var rect = canvas.getBoundingClientRect();
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var width = Math.max(1, Math.round(rect.width));
        var height = Math.max(1, Math.round(rect.height));
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        var ctx = canvas.getContext("2d");
        if (!ctx) return null;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        return { ctx: ctx, w: width, h: height };
    }

    function fieldScene() {
        var canvas = document.getElementById("bg-field");
        if (!canvas) return null;

        var view = prepare(canvas);
        if (!view) return null;
        var colors = themeColors();
        var dots = [];
        var pointer = { x: -9999, y: -9999 };

        function seed() {
            var count = view.w < 700 ? 40 : 90;
            dots = [];
            for (var i = 0; i < count; i++) {
                dots.push({
                    x: Math.random() * view.w,
                    y: Math.random() * view.h,
                    len: 2 + Math.random() * 7,
                    speed: 0.12 + Math.random() * 0.45,
                    phase: Math.random() * Math.PI * 2,
                    alpha: 0.1 + Math.random() * 0.38
                });
            }
        }

        function paint(time, delta) {
            var ctx = view.ctx;
            ctx.clearRect(0, 0, view.w, view.h);
            ctx.strokeStyle = colors.ink;
            ctx.lineCap = "round";
            ctx.lineWidth = 1.4;

            dots.forEach(function (dot) {
                var wind = Math.sin(time * 0.0005 + dot.phase) * 7;
                var dx = pointer.x - dot.x;
                var dy = pointer.y - dot.y;
                var dist = Math.sqrt(dx * dx + dy * dy) || 1;
                var push = dist < 140 ? ((140 - dist) / 140) * 16 : 0;
                var px = dot.x + (push ? (dx / dist) * push : 0);
                var py = dot.y + wind + (push ? (dy / dist) * push : 0);

                ctx.globalAlpha = dot.alpha;
                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(px + dot.len, py - dot.len * 0.3);
                ctx.stroke();

                if (delta) {
                    dot.x -= dot.speed * (delta / 16);
                    if (dot.x < -14) {
                        dot.x = view.w + 14;
                        dot.y = Math.random() * view.h;
                    }
                }
            });

            ctx.globalAlpha = 1;
        }

        document.addEventListener("pointermove", function (event) {
            pointer.x = event.clientX;
            pointer.y = event.clientY;
        }, { passive: true });

        document.addEventListener("pointerleave", function () {
            pointer.x = -9999;
            pointer.y = -9999;
        });

        seed();

        return {
            paint: paint,
            resize: function () {
                view = prepare(canvas) || view;
                seed();
            },
            retheme: function () {
                colors = themeColors();
            }
        };
    }

    function climbScene() {
        var canvas = document.getElementById("nav-terrain");
        if (!canvas) return null;

        var view = prepare(canvas);
        if (!view) return null;
        var colors = themeColors();
        var steps = [];
        var progress = 0;

        function build() {
            steps = [];
            var count = Math.max(14, Math.min(40, Math.round(view.w / 34)));
            var rise = view.h - 5;
            for (var i = 0; i < count; i++) {
                var t = i / (count - 1);
                steps.push({
                    x: Math.round(t * (view.w - 4)) + 2,
                    y: Math.round(view.h - 1 - t * rise)
                });
            }
        }

        function measure() {
            var max = document.documentElement.scrollHeight - window.innerHeight;
            progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        }

        function paint() {
            var ctx = view.ctx;
            ctx.clearRect(0, 0, view.w, view.h);
            if (steps.length < 2) return;

            var edge = progress * (steps.length - 1);
            var spacing = 5;

            for (var i = 0; i < steps.length - 1; i++) {
                var a = steps[i];
                var b = steps[i + 1];
                var reached = i < edge;
                ctx.fillStyle = reached ? colors.accent : colors.ink;
                ctx.globalAlpha = reached ? 0.9 : 0.22;

                for (var x = a.x; x <= b.x; x += spacing) {
                    ctx.beginPath();
                    ctx.arc(x, a.y, 1.3, 0, Math.PI * 2);
                    ctx.fill();
                }
                for (var y2 = b.y + spacing; y2 < a.y; y2 += spacing) {
                    ctx.beginPath();
                    ctx.arc(b.x, y2, 1.1, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            var index = Math.min(steps.length - 1, Math.round(edge));
            var climber = steps[index];
            ctx.globalAlpha = 0.95;
            ctx.fillStyle = colors.ink;
            ctx.beginPath();
            ctx.arc(climber.x, Math.max(3, climber.y - 5), 2.6, 0, Math.PI * 2);
            ctx.fill();
        }

        function onScroll() {
            measure();
            if (reduceMotion) paint();
        }

        window.addEventListener("scroll", onScroll, { passive: true });
        build();
        measure();

        return {
            paint: paint,
            resize: function () {
                view = prepare(canvas) || view;
                build();
                measure();
            },
            retheme: function () {
                colors = themeColors();
            }
        };
    }

    function rippleScene() {
        var canvas = document.getElementById("ripple-footer");
        if (!canvas) return null;
        var host = canvas.closest(".footer-frame") || canvas.parentElement;
        if (!host) return null;

        var view = prepare(canvas);
        if (!view) return null;
        var colors = themeColors();
        var rings = [];
        var visible = true;
        var idle = 0;
        var base = document.createElement("canvas");

        function paintWash() {
            base.width = view.ctx.canvas.width;
            base.height = view.ctx.canvas.height;
            var ctx = base.getContext("2d");
            if (!ctx) return;
            var dpr = Math.min(window.devicePixelRatio || 1, 2);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, view.w, view.h);

            var blobs = [
                { x: 0.16, y: 1.02, r: 0.62, color: colors.accent, alpha: 0.2 },
                { x: 0.58, y: 1.08, r: 0.78, color: colors.ink, alpha: 0.07 },
                { x: 0.9, y: 0.96, r: 0.5, color: colors.accent, alpha: 0.14 }
            ];

            blobs.forEach(function (blob) {
                var cx = view.w * blob.x;
                var cy = view.h * blob.y;
                var radius = Math.max(view.w, view.h) * blob.r;
                var gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
                gradient.addColorStop(0, hexToRgba(blob.color, blob.alpha));
                gradient.addColorStop(0.55, hexToRgba(blob.color, blob.alpha * 0.45));
                gradient.addColorStop(1, hexToRgba(blob.color, 0));
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, view.w, view.h);
            });

            // El lavado se desvanece hacia arriba para no dejar un borde recto.
            ctx.globalCompositeOperation = "destination-in";
            var fade = ctx.createLinearGradient(0, 0, 0, view.h);
            fade.addColorStop(0, "rgba(0, 0, 0, 0)");
            fade.addColorStop(0.45, "rgba(0, 0, 0, 1)");
            fade.addColorStop(1, "rgba(0, 0, 0, 1)");
            ctx.fillStyle = fade;
            ctx.fillRect(0, 0, view.w, view.h);
            ctx.globalCompositeOperation = "source-over";
        }

        function spawn(x, y) {
            rings.push({
                x: x,
                y: y,
                radius: 2,
                max: 40 + Math.random() * 80,
                alpha: 0.55
            });
            if (rings.length > 24) rings.shift();
        }

        function paint(time, delta) {
            if (!visible) return;
            var ctx = view.ctx;
            ctx.clearRect(0, 0, view.w, view.h);
            ctx.drawImage(base, 0, 0, view.w, view.h);

            if (!reduceMotion && delta) {
                idle += delta;
                if (idle > 2200) {
                    idle = 0;
                    spawn(view.w * (0.15 + Math.random() * 0.7), view.h * (0.55 + Math.random() * 0.4));
                }
            }

            ctx.lineWidth = 1.2;
            for (var i = rings.length - 1; i >= 0; i--) {
                var ring = rings[i];
                ctx.strokeStyle = hexToRgba(colors.accentText, ring.alpha);
                ctx.beginPath();
                ctx.ellipse(ring.x, ring.y, ring.radius, ring.radius * 0.34, 0, 0, Math.PI * 2);
                ctx.stroke();

                if (delta) {
                    ring.radius += 0.55 * (delta / 16);
                    ring.alpha *= 0.988;
                    ring.y -= 0.06 * (delta / 16);
                }
                if (ring.radius > ring.max || ring.alpha < 0.02) {
                    rings.splice(i, 1);
                }
            }
        }

        host.addEventListener("pointermove", function (event) {
            var rect = canvas.getBoundingClientRect();
            var x = event.clientX - rect.left;
            var y = event.clientY - rect.top;
            if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;
            spawn(x, y);
            if (reduceMotion) paint(0, 0);
        }, { passive: true });

        if (window.IntersectionObserver) {
            new IntersectionObserver(function (entries) {
                visible = entries[0].isIntersecting;
            }, { rootMargin: "80px" }).observe(canvas);
        }

        paintWash();

        return {
            paint: paint,
            resize: function () {
                view = prepare(canvas) || view;
                paintWash();
            },
            retheme: function () {
                colors = themeColors();
                paintWash();
            }
        };
    }

    function tick(time) {
        var delta = lastTime ? Math.min(48, time - lastTime) : 16;
        lastTime = time;
        for (var i = 0; i < scenes.length; i++) {
            scenes[i].paint(time, delta);
        }
        rafId = window.requestAnimationFrame(tick);
    }

    function play() {
        if (rafId || reduceMotion || !scenes.length) return;
        lastTime = 0;
        rafId = window.requestAnimationFrame(tick);
    }

    function pause() {
        if (!rafId) return;
        window.cancelAnimationFrame(rafId);
        rafId = 0;
    }

    function repaint() {
        for (var i = 0; i < scenes.length; i++) {
            scenes[i].paint(0, 0);
        }
    }

    function boot() {
        var field = fieldScene();
        var climb = climbScene();
        var ripples = rippleScene();
        [field, climb, ripples].forEach(function (scene) {
            if (scene) scenes.push(scene);
        });
        if (!scenes.length) return;

        repaint();
        if (!reduceMotion) play();

        var resizeTimer = 0;
        window.addEventListener("resize", function () {
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(function () {
                scenes.forEach(function (scene) { scene.resize(); });
                repaint();
            }, 150);
        }, { passive: true });

        document.addEventListener("visibilitychange", function () {
            if (document.hidden) {
                pause();
            } else {
                play();
            }
        });

        if (window.MutationObserver) {
            new MutationObserver(function () {
                scenes.forEach(function (scene) { scene.retheme(); });
                repaint();
            }).observe(root, { attributes: true, attributeFilter: ["data-theme", "style"] });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    } else {
        boot();
    }
}());
