{
  "meta": {
    "project": "The Neoverse — Neo Brightwell",
    "app_type": "immersive_artist_experience / mythological_world_site",
    "north_star": "Visitors feel they crossed a threshold into a sacred, discovered archive—intimate, mysterious, literary, spiritual, cinematic, rebellious, haunted, hopeful.",
    "non_goals": [
      "Not a portfolio template",
      "Not corporate / startup minimal",
      "Not generic music-industry promo",
      "No autoplay intros, no scroll-jacking, no forced loading sequences"
    ],
    "implementation_note": "Codebase uses React .js (not .tsx). Use shadcn/ui components from /app/frontend/src/components/ui/*.jsx and heavily customize via Tailwind + CSS variables."
  },

  "brand_attributes": {
    "tone_words": [
      "handcrafted",
      "mythic",
      "archival",
      "chapel-at-midnight",
      "roadside-neon",
      "radio-transmission",
      "sacred-document",
      "rebellious-hope"
    ],
    "visual_metaphors": [
      "Roadside chapel threshold",
      "Box of unsent letters",
      "Recovered archive drawers",
      "Neon sign through rain",
      "Celestial map / constellations",
      "Vintage film grain + dust"
    ]
  },

  "google_fonts": {
    "recommended_pairings": [
      {
        "heading_serif": "Cormorant Garamond (600/700)",
        "body_sans": "IBM Plex Sans (400/500)",
        "mono": "IBM Plex Mono (400)",
        "why": "Cormorant feels literary + sacred; Plex Sans stays readable on mobile; Plex Mono supports coordinates/frequencies/archival metadata."
      },
      {
        "heading_serif": "Spectral (600/700)",
        "body_sans": "Work Sans (400/500)",
        "mono": "Source Code Pro (400)",
        "why": "Spectral reads like a poetry collection; Work Sans is neutral and modern without feeling corporate; mono for recovered fragments."
      }
    ],
    "default_choice": {
      "heading_serif": "Cormorant Garamond",
      "body_sans": "IBM Plex Sans",
      "mono": "IBM Plex Mono"
    },
    "import_snippet": "/* index.css */\n@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');"
  },

  "color_system": {
    "notes": [
      "Primary palette: midnight black, deep charcoal, weathered silver.",
      "Accents: moonlit blue, violet, faded gold.",
      "Occasional sparks only: neon crimson, ember orange.",
      "Avoid bright modern gradients and corporate blues.",
      "Use gradients only as subtle atmospheric overlays (<=20% viewport)."
    ],
    "css_variables": {
      "how_to_apply": "Replace :root and .dark tokens in /app/frontend/src/index.css with these HSL tokens (shadcn expects HSL). Keep a single theme (dark-leaning) but still readable. Use .dark on <html> by default.",
      "tokens_hsl": {
        "--background": "220 10% 6%",
        "--foreground": "40 18% 92%",

        "--card": "220 10% 8%",
        "--card-foreground": "40 18% 92%",

        "--popover": "220 10% 8%",
        "--popover-foreground": "40 18% 92%",

        "--primary": "40 18% 92%",
        "--primary-foreground": "220 10% 6%",

        "--secondary": "220 9% 12%",
        "--secondary-foreground": "40 18% 92%",

        "--muted": "220 8% 14%",
        "--muted-foreground": "40 8% 70%",

        "--accent": "214 35% 62%",
        "--accent-foreground": "220 10% 6%",

        "--destructive": "2 62% 52%",
        "--destructive-foreground": "40 18% 92%",

        "--border": "220 8% 18%",
        "--input": "220 8% 18%",
        "--ring": "44 52% 62%",

        "--radius": "0.75rem",

        "--chart-1": "214 35% 62%",
        "--chart-2": "44 52% 62%",
        "--chart-3": "268 28% 58%",
        "--chart-4": "12 55% 56%",
        "--chart-5": "28 70% 58%"
      },
      "extended_hex_palette": {
        "ink": {
          "midnight_black": "#0B0C0F",
          "deep_charcoal": "#14161B",
          "smoke": "#1E2129",
          "shadow_blue": "#0E1622"
        },
        "paper_neutrals": {
          "weathered_silver": "#C7C2B8",
          "bone_paper": "#E7E0D6",
          "ash_paper": "#D6D0C7",
          "tarnished_metal": "#8E8A82"
        },
        "accents": {
          "moonlit_blue": "#7FA6C7",
          "violet_ink": "#7B6A9A",
          "faded_gold": "#C7A86A"
        },
        "sparks_rare": {
          "neon_crimson": "#D14B4B",
          "ember_orange": "#D07A3A"
        },
        "state": {
          "success": "#6FAF8A",
          "warning": "#C7A86A",
          "info": "#7FA6C7"
        }
      },
      "usage_rules": {
        "reading_surfaces": "Use deep charcoal cards with subtle border; never put long-form text on noisy/gradient backgrounds.",
        "accent_discipline": "Moonlit blue + faded gold are primary accents. Violet is secondary. Crimson/orange only for rare emphasis (e.g., live event badge).",
        "focus_ring": "Use faded gold ring for focus-visible across the site.",
        "admin": "Admin uses higher contrast neutrals + clearer borders; keep accents minimal (moonlit blue for primary actions)."
      }
    },

    "gradients_and_overlays": {
      "allowed_gradients": [
        {
          "name": "Chapel Dusk Wash",
          "css": "radial-gradient(1200px circle at 20% 10%, rgba(127,166,199,0.14), transparent 55%), radial-gradient(900px circle at 80% 30%, rgba(199,168,106,0.10), transparent 60%)",
          "use": "Hero background overlay only (<=20% viewport)."
        },
        {
          "name": "Neon Rain Hint",
          "css": "linear-gradient(135deg, rgba(209,75,75,0.10), rgba(127,166,199,0.08) 55%, transparent 100%)",
          "use": "Decorative corner overlay on album pages; never behind paragraphs."
        }
      ],
      "texture_overlays": {
        "film_grain_css": "background-image: url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"180\" height=\"180\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"3\" stitchTiles=\"stitch\"/></filter><rect width=\"180\" height=\"180\" filter=\"url(%23n)\" opacity=\"0.18\"/></svg>'); mix-blend-mode: overlay; opacity: 0.10;",
        "dust_css": "background-image: radial-gradient(circle at 20% 30%, rgba(231,224,214,0.06) 0 1px, transparent 2px), radial-gradient(circle at 70% 60%, rgba(231,224,214,0.05) 0 1px, transparent 2px); background-size: 220px 220px; opacity: 0.35;",
        "scanline_css": "background-image: repeating-linear-gradient(to bottom, rgba(199,194,184,0.05), rgba(199,194,184,0.05) 1px, transparent 2px, transparent 6px); opacity: 0.12;",
        "rule": "Textures must be subtle and never reduce text contrast. Provide a toggle honoring prefers-reduced-motion and prefers-contrast where possible."
      }
    }
  },

  "typography": {
    "scale": {
      "h1": "text-4xl sm:text-5xl lg:text-6xl",
      "h2": "text-base md:text-lg",
      "body": "text-sm md:text-base",
      "small": "text-xs text-muted-foreground"
    },
    "styles": {
      "headings": "font-[Cormorant_Garamond] tracking-[-0.01em] leading-[1.05]",
      "body": "font-[IBM_Plex_Sans] leading-[1.7]",
      "mono_meta": "font-[IBM_Plex_Mono] tracking-[0.08em] uppercase text-[11px]"
    },
    "editorial_rules": [
      "Use italics sparingly for epigraphs and marginal notes.",
      "Use small caps (via tracking + uppercase) for archival metadata: frequencies, coordinates, recovered fragment IDs.",
      "Avoid overly tight line-height; long-form reading must breathe.",
      "Never center-align long paragraphs; reserve centered text for short invocations/epigraphs only."
    ]
  },

  "layout_system": {
    "grid": {
      "container": "max-w-[1120px] mx-auto px-4 sm:px-6",
      "reading_container": "max-w-[720px] mx-auto px-4 sm:px-6",
      "bento": "grid grid-cols-1 md:grid-cols-12 gap-6",
      "album_room_split": "grid grid-cols-1 lg:grid-cols-12 gap-8"
    },
    "spacing": {
      "section_y": "py-14 sm:py-18 lg:py-24",
      "stack": "space-y-6 sm:space-y-8",
      "micro": "gap-2",
      "rule": "Use 2–3x more spacing than feels comfortable; the world should feel quiet and intentional."
    },
    "borders_radius_shadows": {
      "radius": "rounded-xl (cards), rounded-2xl (hero frames), rounded-md (inputs)",
      "borders": "border border-border/70",
      "shadows": "shadow-[0_18px_60px_rgba(0,0,0,0.45)] for hero frames; subtle shadow for cards only"
    }
  },

  "iconography": {
    "library": "lucide-react (preferred) or FontAwesome CDN if needed",
    "motifs": {
      "crescent": "Use as a subtle watermark or nav marker; never cartoonish.",
      "star": "Use for Observatory and constellation interactions.",
      "eye": "Use for The Witness / hidden details.",
      "liminality_glyph": "Custom SVG (simple line glyph) used as divider and loading mark."
    },
    "stroke_style": "1.5px stroke, rounded caps, slightly imperfect via CSS filter: drop-shadow(0 0 10px rgba(199,168,106,0.12)) on hover only."
  },

  "component_path": {
    "shadcn_primary": {
      "Button": "/app/frontend/src/components/ui/button.jsx",
      "Card": "/app/frontend/src/components/ui/card.jsx",
      "Tabs": "/app/frontend/src/components/ui/tabs.jsx",
      "Dialog": "/app/frontend/src/components/ui/dialog.jsx",
      "Sheet": "/app/frontend/src/components/ui/sheet.jsx",
      "NavigationMenu": "/app/frontend/src/components/ui/navigation-menu.jsx",
      "ScrollArea": "/app/frontend/src/components/ui/scroll-area.jsx",
      "Accordion": "/app/frontend/src/components/ui/accordion.jsx",
      "Tooltip": "/app/frontend/src/components/ui/tooltip.jsx",
      "Carousel": "/app/frontend/src/components/ui/carousel.jsx",
      "Table": "/app/frontend/src/components/ui/table.jsx",
      "Input": "/app/frontend/src/components/ui/input.jsx",
      "Textarea": "/app/frontend/src/components/ui/textarea.jsx",
      "Form": "/app/frontend/src/components/ui/form.jsx",
      "SonnerToast": "/app/frontend/src/components/ui/sonner.jsx",
      "Calendar": "/app/frontend/src/components/ui/calendar.jsx",
      "Badge": "/app/frontend/src/components/ui/badge.jsx",
      "Separator": "/app/frontend/src/components/ui/separator.jsx",
      "Skeleton": "/app/frontend/src/components/ui/skeleton.jsx"
    },
    "custom_components_to_create": [
      "/app/frontend/src/components/neoverse/ThresholdHero.js",
      "/app/frontend/src/components/neoverse/ArchiveDoor.js",
      "/app/frontend/src/components/neoverse/AlbumRoomShell.js",
      "/app/frontend/src/components/neoverse/AtmosphereLayer.js",
      "/app/frontend/src/components/neoverse/IntegratedAudioPlayer.js",
      "/app/frontend/src/components/neoverse/LibraryReader.js",
      "/app/frontend/src/components/neoverse/SymbolConstellation.js",
      "/app/frontend/src/components/neoverse/RoadhouseBoard.js",
      "/app/frontend/src/components/neoverse/ObservatoryGallery.js",
      "/app/frontend/src/components/neoverse/InvocationForm.js",
      "/app/frontend/src/components/admin/AdminShell.js"
    ],
    "notes": "Keep custom components small and composable; wrap shadcn primitives with on-brand styling."
  },

  "page_blueprints": {
    "global_nav": {
      "pattern": "A quiet top nav that feels like a header from a sacred manuscript: left = glyph mark, center = section links, right = Invocation.",
      "mobile": "Use Sheet for nav; include a small epigraph line at top of the sheet.",
      "data_testids": {
        "nav": "global-nav",
        "nav-open": "global-nav-open-button",
        "nav-invocation": "global-nav-invocation-link"
      }
    },

    "threshold_homepage": {
      "goal": "Crossing the threshold into The Neoverse.",
      "layout": [
        "Hero: cinematic frame + epigraph + primary portal CTA",
        "Three portals: Archive / Library / Observatory",
        "Roadhouse strip (latest dispatches)",
        "Invocation block (in-world signup)",
        "Footer as 'colophon'"
      ],
      "threshold_hero": {
        "visual": "A tall, chapel-like frame (rounded-2xl) with subtle light bloom and grain. Background image optional; if used, keep it dark and low-contrast.",
        "copy_blocks": {
          "epigraph": "[PLACEHOLDER EPIGRAPH — short, 1–2 lines]",
          "headline": "Enter the Neoverse",
          "subhead": "[PLACEHOLDER — atmospheric line, not lore]"
        },
        "cta": {
          "primary": "Enter The Archive",
          "secondary": "Open The Library"
        },
        "wow_moment_1": "As the hero enters viewport, the Archive frame 'illuminates' from within (opacity + subtle radial glow) over 1200–1800ms. No flash.",
        "classes": {
          "hero_wrap": "relative overflow-hidden rounded-2xl border border-border/70 bg-[hsl(var(--card))] shadow-[0_18px_60px_rgba(0,0,0,0.45)]",
          "hero_overlay": "pointer-events-none absolute inset-0",
          "hero_content": "relative z-10 p-6 sm:p-10 lg:p-14"
        },
        "data_testids": {
          "hero": "threshold-hero",
          "cta-enter-archive": "threshold-hero-enter-archive-button",
          "cta-open-library": "threshold-hero-open-library-button"
        }
      }
    },

    "archive_index": {
      "goal": "A door/entry into four album rooms.",
      "layout": "Single column on mobile; on desktop, a 2x2 grid of album doors with distinct atmospheres.",
      "archive_door_component": {
        "interaction": "Hover/press reveals faint constellation lines + a 'handle' highlight; on click, door opens via page transition.",
        "wow_moment_2": "The Archive slowly illuminates as visitor enters: each door gains a soft inner glow sequentially (stagger 120ms).",
        "classes": {
          "door": "group relative overflow-hidden rounded-2xl border border-border/70 bg-[hsl(var(--card))] p-5 sm:p-6",
          "door_title": "font-[Cormorant_Garamond] text-2xl sm:text-3xl",
          "door_meta": "mt-2 text-xs tracking-[0.18em] uppercase text-muted-foreground"
        },
        "data_testids": {
          "archive-grid": "archive-album-grid",
          "album-door": "archive-album-door"
        }
      }
    },

    "album_rooms": {
      "shared_shell": {
        "layout": "Top: album title + epigraph. Middle: integrated audio player. Lower: tracklist/liner notes tabs + streaming links. Side rail on desktop: recovered fragments / coordinates.",
        "components": ["Tabs", "Card", "ScrollArea", "Button", "Badge", "Separator"],
        "data_testids": {
          "player": "album-audio-player",
          "streaming-links": "album-streaming-links",
          "tracklist": "album-tracklist",
          "liner-notes": "album-liner-notes"
        }
      },
      "atmospheres": {
        "neon-rodeo": {
          "mood": "Desert highway at dusk; neon sign through rain; distant radio.",
          "palette_bias": "moonlit_blue + weathered_silver; rare crimson pinprick.",
          "background_layers": [
            "Dust drift (very subtle)",
            "Low star field near top only",
            "Diagonal 'road' vignette shadow"
          ],
          "accent_detail": "A thin neon line (crimson at 8% opacity) appears only on hover of key CTAs.",
          "classes": {
            "room_bg": "bg-[radial-gradient(900px_circle_at_20%_10%,rgba(127,166,199,0.12),transparent_55%),radial-gradient(700px_circle_at_80%_30%,rgba(199,168,106,0.08),transparent_60%)]"
          }
        },
        "an-american-reckoning": {
          "mood": "Fire and testimony; heat shimmer; ash.",
          "palette_bias": "faded_gold + ember_orange (rare) + charcoal.",
          "background_layers": [
            "Slow ember specks (few)",
            "Ash paper texture overlay",
            "Subtle heat haze on hero image only"
          ],
          "rule": "No animated flames. Only suggestion: drifting ember dots at 0.15 opacity.",
          "classes": {
            "room_bg": "bg-[radial-gradient(900px_circle_at_30%_20%,rgba(208,122,58,0.10),transparent_55%),radial-gradient(700px_circle_at_70%_10%,rgba(199,168,106,0.10),transparent_60%)]"
          }
        },
        "we-didnt-survive-to-be-quiet": {
          "mood": "Archive of survivors; sacred records; drawers and marginalia.",
          "palette_bias": "weathered_silver + violet_ink.",
          "background_layers": [
            "Paper fibers texture",
            "Faint stamp marks (SVG) in corners",
            "Slow page-dust motes"
          ],
          "interaction": "Hover on fragments reveals marginal notes (Tooltip/HoverCard).",
          "classes": {
            "room_bg": "bg-[radial-gradient(900px_circle_at_20%_10%,rgba(123,106,154,0.10),transparent_55%),radial-gradient(700px_circle_at_80%_30%,rgba(199,194,184,0.10),transparent_60%)]"
          }
        },
        "burn-bright-stay-free": {
          "mood": "Liberation, endurance, transformation; moonlight + open road.",
          "palette_bias": "moonlit_blue + faded_gold; cleanest contrast.",
          "background_layers": [
            "Soft aurora-like wash (very mild)",
            "Star field appears during transitions",
            "Subtle light sweep across headings"
          ],
          "classes": {
            "room_bg": "bg-[radial-gradient(900px_circle_at_50%_0%,rgba(127,166,199,0.14),transparent_55%),radial-gradient(700px_circle_at_80%_40%,rgba(199,168,106,0.10),transparent_60%)]"
          }
        }
      }
    },

    "integrated_audio_player": {
      "principle": "Must feel like an artifact: a radio faceplate + tape label, not a generic widget.",
      "structure": [
        "Left: play/pause + scrubber",
        "Center: track title + time",
        "Right: volume + 'frequency' readout (decorative)"
      ],
      "shadcn_primitives": ["Card", "Slider", "Button", "Tooltip"],
      "styling": {
        "player_card": "relative overflow-hidden rounded-2xl border border-border/70 bg-[hsl(var(--card))] p-4 sm:p-5",
        "label_strip": "mb-3 flex items-center justify-between gap-3",
        "tape_label": "rounded-md bg-[rgba(231,224,214,0.06)] px-3 py-1 text-[11px] tracking-[0.18em] uppercase text-[rgba(231,224,214,0.78)]",
        "scrubber": "mt-3"
      },
      "micro_interactions": [
        "Play button press scale 0.98; hover adds faint gold ring glow.",
        "Scrubber thumb shows a tiny crescent glyph on hover.",
        "On track change: crossfade title opacity (200ms) + subtle slide (6px)."
      ],
      "data_testids": {
        "play": "audio-player-play-button",
        "pause": "audio-player-pause-button",
        "seek": "audio-player-seek-slider",
        "volume": "audio-player-volume-slider",
        "track-title": "audio-player-track-title"
      }
    },

    "library": {
      "index": {
        "mood": "Sacred reading room.",
        "layout": "Filterable list with archival metadata; avoid dense tables on mobile.",
        "components": ["Input", "Tabs", "Card", "Badge", "Pagination"],
        "data_testids": {
          "search": "library-search-input",
          "filter-tabs": "library-filter-tabs",
          "item": "library-item-card"
        }
      },
      "reader": {
        "layout": "Reading container max 720px; left margin notes on desktop; sticky progress indicator.",
        "components": ["ScrollArea", "Separator", "Tooltip"],
        "reader_styles": {
          "paper": "rounded-2xl border border-border/70 bg-[rgba(231,224,214,0.04)] p-6 sm:p-10",
          "dropcap": "first-letter:float-left first-letter:mr-3 first-letter:mt-2 first-letter:text-5xl first-letter:font-[Cormorant_Garamond] first-letter:text-[rgba(199,168,106,0.95)]",
          "selection": "selection:bg-[rgba(199,168,106,0.22)] selection:text-[rgba(231,224,214,0.95)]"
        },
        "data_testids": {
          "reader": "library-reader",
          "toc": "library-reader-toc",
          "progress": "library-reader-progress"
        }
      }
    },

    "symbols": {
      "index": {
        "layout": "Constellation grid: symbols as nodes; hover draws connecting lines.",
        "components": ["Tooltip", "HoverCard", "Card"],
        "data_testids": {
          "symbols-constellation": "symbols-constellation",
          "symbol-node": "symbol-node"
        }
      },
      "deep_page": {
        "layout": "Left: symbol mark + short definition. Right: occurrences list (Archive/Library references).",
        "interaction": "Hover occurrences reveals marginal note preview (HoverCard).",
        "data_testids": {
          "symbol-title": "symbol-title",
          "symbol-occurrences": "symbol-occurrences"
        }
      }
    },

    "roadhouse": {
      "mood": "Desert dance hall bulletin board.",
      "layout": "Masonry-like pinned notes (but implemented as responsive grid).",
      "components": ["Card", "Badge", "Separator", "Dialog"],
      "styling": {
        "note": "rotate-[-0.4deg] hover:rotate-0 transition-transform duration-200",
        "pin": "absolute -top-2 left-6 h-3 w-3 rounded-full bg-[rgba(209,75,75,0.55)] shadow-[0_0_0_3px_rgba(209,75,75,0.12)]"
      },
      "data_testids": {
        "board": "roadhouse-board",
        "post": "roadhouse-post-card",
        "post-open": "roadhouse-post-open-button"
      }
    },

    "observatory": {
      "mood": "Celestial gallery; quiet awe.",
      "layout": "Gallery grid with AspectRatio; hover reveals title like a caption plate.",
      "components": ["AspectRatio", "Card", "Carousel", "Dialog"],
      "interaction": "Hover: starfield intensifies slightly behind the hovered card only.",
      "data_testids": {
        "gallery": "observatory-gallery",
        "art-card": "observatory-art-card"
      }
    },

    "invocation": {
      "principle": "In-world, literary, not marketing.",
      "layout": "A single sacred form card with epigraph + promise line + email field.",
      "components": ["Card", "Input", "Button", "SonnerToast"],
      "copy": {
        "headline": "The Invocation",
        "subhead": "Leave a light on in the archive. Receive transmissions from the road—new music, poems, artwork, and dispatches from the Neoverse.",
        "placeholder": "your@email.com",
        "cta": "Leave a light on",
        "fineprint": "[PLACEHOLDER: consent / privacy line]"
      },
      "confirmation_state": {
        "title": "A signal received.",
        "body": "Check your inbox to confirm. The Archive keeps its doors closed until you answer.",
        "secondary": "Return to the Threshold"
      },
      "data_testids": {
        "form": "invocation-form",
        "email": "invocation-email-input",
        "submit": "invocation-submit-button",
        "success": "invocation-confirmation-state"
      }
    },

    "admin": {
      "aesthetic": "Utilitarian but on-brand: charcoal surfaces, clear borders, minimal texture, readable tables.",
      "layout": "Left sidebar + main content. Use Table, Dialog, Form, Tabs.",
      "rules": [
        "No heavy textures in admin.",
        "Use moonlit blue for primary buttons; gold only for focus ring.",
        "Forms must be extremely legible; increase input background contrast."
      ],
      "data_testids": {
        "admin-shell": "admin-shell",
        "admin-login-form": "admin-login-form",
        "admin-save": "admin-save-button"
      }
    }
  },

  "motion_system": {
    "library": "framer-motion",
    "principles": [
      "Mystery > motion. Subtle, cinematic, never distracting.",
      "Honor prefers-reduced-motion: disable parallax/particles; keep fades minimal.",
      "No scroll-jacking. No autoplay sequences."
    ],
    "durations": {
      "micro": "120–180ms",
      "standard": "220–320ms",
      "cinematic": "900–1800ms"
    },
    "easings": {
      "standard": "[0.22, 1, 0.36, 1]",
      "soft": "[0.16, 1, 0.3, 1]"
    },
    "patterns": {
      "page_turn_transition": {
        "description": "Route transitions feel like turning a page in an archive: slight x-translate + opacity + subtle shadow sweep.",
        "framer_scaffold_js": "// Wrap routes with <AnimatePresence mode=\"wait\">\n// motion.main key={location.pathname}\nconst pageVariants = {\n  initial: { opacity: 0, x: 10 },\n  animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.22,1,0.36,1] } },\n  exit: { opacity: 0, x: -10, transition: { duration: 0.25, ease: [0.22,1,0.36,1] } }\n};"
      },
      "dust_particles": {
        "description": "CSS-only dust motes drifting slowly (no canvas).",
        "css_scaffold": ".dust { position:absolute; inset:0; pointer-events:none; background-image: radial-gradient(circle, rgba(231,224,214,0.08) 0 1px, transparent 2px); background-size: 240px 240px; opacity:0.25; animation: dustDrift 18s linear infinite; }\n@keyframes dustDrift { from { transform: translate3d(0,0,0); } to { transform: translate3d(-40px, 30px, 0); } }"
      },
      "film_grain": {
        "description": "Static grain overlay (no animation) for performance; optional very slow opacity breathing (reduced-motion disables).",
        "css_scaffold": ".grain { position:absolute; inset:-20%; background-size:180px 180px; opacity:0.10; mix-blend-mode: overlay; }"
      },
      "star_field": {
        "description": "Top-of-page star field only; intensifies slightly on hover of Observatory items.",
        "css_scaffold": ".stars { position:absolute; inset:0; pointer-events:none; background-image: radial-gradient(circle at 20% 30%, rgba(231,224,214,0.10) 0 1px, transparent 2px), radial-gradient(circle at 70% 60%, rgba(231,224,214,0.08) 0 1px, transparent 2px); background-size: 320px 320px; opacity:0.18; }"
      },
      "selune_wow": {
        "description": "Sélune (crescent) subtly appears during certain transitions (e.g., entering Observatory or Archive).",
        "implementation": "Render a fixed-position SVG crescent at top-right with opacity 0 -> 0.22 over 1200ms; only once per session (localStorage flag)."
      },
      "constellation_hover": {
        "description": "On hover of a symbol node, draw connecting lines to 2–4 nearby nodes.",
        "implementation": "Use SVG overlay with animated stroke-dashoffset (220ms). Keep lines thin and low opacity."
      }
    }
  },

  "micro_interactions": {
    "buttons": {
      "shape": "Rounded (8–12px) — elegant/literary.",
      "variants": {
        "primary": "Solid bone/ink inversion: bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]",
        "secondary": "Charcoal surface with border: bg-[hsl(var(--secondary))] border border-border/70",
        "ghost": "Transparent with underline reveal"
      },
      "motion": "hover: translateY(-1px) + subtle glow; active: scale(0.98).",
      "focus": "focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))]",
      "rule": "Never use transition: all. Use transition-colors, transition-shadow, transition-opacity, transition-transform selectively."
    },
    "links": {
      "style": "Underlines appear like pencil marks: underline-offset-4 decoration-[rgba(199,168,106,0.55)] hover:decoration-[rgba(199,168,106,0.9)]",
      "hover": "Tiny left-to-right shimmer on underline (optional)."
    },
    "cards": {
      "hover": "Border brightens slightly + inner glow; no big scale jumps.",
      "press": "Translate 1px down."
    }
  },

  "accessibility": {
    "requirements": [
      "WCAG-aware contrast: body text must remain readable over textures.",
      "prefers-reduced-motion: disable dust drift, parallax, constellation animations; keep simple fades.",
      "Keyboard navigation: visible focus ring (faded gold).",
      "Semantic HTML for reading pages (article, header, nav).",
      "Alt text for all Observatory images."
    ],
    "testing": {
      "data_testid_rule": "All interactive and key informational elements MUST include data-testid in kebab-case describing role.",
      "examples": [
        "data-testid=\"archive-album-door-neon-rodeo\"",
        "data-testid=\"library-reader-progress\"",
        "data-testid=\"invocation-submit-button\"",
        "data-testid=\"admin-content-save-button\""
      ]
    }
  },

  "seo": {
    "rules": [
      "Unique title/description per page.",
      "OpenGraph image per major section (Threshold, Archive, each album room).",
      "Sitemap + clean slugs.",
      "Use canonical URLs."
    ]
  },

  "image_urls": {
    "hero_threshold_optional": [
      {
        "url": "https://images.unsplash.com/photo-1605571925268-bd3129e7df97?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MjJ8MHwxfHNlYXJjaHwxfHxuaWdodCUyMGRlc2VydCUyMGhpZ2h3YXklMjBuZW9uJTIwc2lnbnxlbnwwfHx8Ymx1ZXwxNzgxNTI4ODExfDA&ixlib=rb-4.1.0&q=85",
        "description": "Desert road at dusk tone reference (use as blurred/low-opacity background only)."
      }
    ],
    "neon_sign_reference": [
      {
        "url": "https://images.unsplash.com/photo-1570631130197-e4ab19abb590?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MjJ8MHwxfHNlYXJjaHwzfHxuaWdodCUyMGRlc2VydCUyMGhpZ2h3YXklMjBuZW9uJTIwc2lnbnxlbnwwfHx8Ymx1ZXwxNzgxNTI4ODExfDA&ixlib=rb-4.1.0&q=85",
        "description": "Minimal neon sign silhouette (good for Archive door thumbnails)."
      }
    ],
    "archive_textures": [
      {
        "url": "https://images.unsplash.com/photo-1546199881-3454b82b832b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHxvbGQlMjBsZWF0aGVyJTIwam91cm5hbCUyMHZpbnRhZ2UlMjBsZXR0ZXJzJTIwYXJjaGl2ZXxlbnwwfHx8YmxhY2t8MTc4MTUyODgxNnww&ixlib=rb-4.1.0&q=85",
        "description": "Old letters/papers texture reference (use as subtle masked overlay)."
      }
    ],
    "stars": [
      {
        "url": "https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwxfHxuaWdodCUyMHNreSUyMHN0YXJzJTIwZmlsbSUyMGdyYWluJTIwdGV4dHVyZXxlbnwwfHx8YmxhY2t8MTc4MTUyODgyMXww&ixlib=rb-4.1.0&q=85",
        "description": "Star field reference (use as top vignette only)."
      }
    ]
  },

  "hidden_worldbuilding_easter_eggs": {
    "principles": [
      "Reward attention; never block navigation.",
      "Keep them optional and subtle.",
      "Use consistent archival language: recovered fragment, accession number, frequency, coordinates."
    ],
    "ideas": [
      {
        "where": "Footer colophon",
        "what": "A tiny 'frequency' that changes daily (deterministic by date) and links to a hidden /signal page (later)."
      },
      {
        "where": "Archive doors",
        "what": "Long-press (mobile) reveals a marginal note tooltip with coordinates (non-lore placeholder allowed)."
      },
      {
        "where": "Library reader",
        "what": "Selecting text shows a small 'bookmark' action that saves a 'fragment' locally (localStorage)."
      },
      {
        "where": "Symbols constellation",
        "what": "Hovering a node for 4 seconds reveals a faint secondary glyph behind it (opacity 0.06)."
      }
    ]
  },

  "libraries_and_setup": {
    "required": [
      {
        "name": "framer-motion",
        "install": "npm i framer-motion",
        "use": "Page transitions, subtle reveals, constellation hover stroke animations."
      },
      {
        "name": "lucide-react",
        "install": "npm i lucide-react",
        "use": "Icons (crescent/star/eye approximations + UI icons)."
      }
    ],
    "optional": [
      {
        "name": "react-intersection-observer",
        "install": "npm i react-intersection-observer",
        "use": "Trigger illumination wow moment when Archive enters viewport."
      }
    ]
  },

  "instructions_to_main_agent": [
    "1) Replace default CRA App.css usage; remove centered App-header patterns. Do not center-align the entire app container.",
    "2) Set <html class=\"dark\"> by default and replace shadcn tokens in index.css with the provided HSL tokens.",
    "3) Implement global texture layers as reusable <AtmosphereLayer /> with props: grain, dust, stars, wash. Ensure pointer-events-none.",
    "4) Build the Threshold hero and Archive doors first; keep wow moments to exactly two (hero illumination + archive sequential glow).",
    "5) Implement IntegratedAudioPlayer using shadcn Slider/Button/Card; style as radio/tape artifact; add streaming link buttons with data-testid.",
    "6) Library reader must prioritize readability: max-w 720px, high line-height, minimal motion.",
    "7) Symbols constellation: SVG overlay lines on hover; keep opacity low; respect reduced motion.",
    "8) Roadhouse board: pinned-note cards with slight rotation; open details in Dialog.",
    "9) Observatory: AspectRatio grid + Dialog/Carousel for viewing; starfield hover intensifies only behind hovered card.",
    "10) Invocation: in-world copy; after submit show confirmation state card; use sonner for toasts.",
    "11) Admin: separate layout shell; utilitarian; tables/forms; minimal texture.",
    "12) Add data-testid to every interactive element and key info block (kebab-case)."
  ],

  "general_ui_ux_design_guidelines": [
    "- You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms",
    "- You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text",
    "- NEVER: use AI assistant Emoji characters like`🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇 etc for icons. Always use **FontAwesome cdn** or **lucid-react** library already installed in the package.json",
    "\n **GRADIENT RESTRICTION RULE**\nNEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element.  Prohibited gradients: blue-500 to purple 600, purple 500 to pink-500, green-500 to blue-500, red to pink etc\nNEVER use dark gradients for logo, testimonial, footer etc\nNEVER let gradients cover more than 20% of the viewport.\nNEVER apply gradients to text-heavy content or reading areas.\nNEVER use gradients on small UI elements (<100px width).\nNEVER stack multiple gradient layers in the same viewport.\n\n**ENFORCEMENT RULE:**\n    • Id gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors\n\n**How and where to use:**\n   • Section backgrounds (not content backgrounds)\n   • Hero section header content. Eg: dark to light to dark color\n   • Decorative overlays and accent elements only\n   • Hero section with 2-3 mild color\n   • Gradients creation can be done for any angle say horizontal, vertical or diagonal\n\n- For AI chat, voice application, **do not use purple color. Use color like light green, ocean blue, peach orange etc\n\n</Font Guidelines>\n\n- Every interaction needs micro-animations - hover states, transitions, parallax effects, and entrance animations. Static = dead.\n   \n- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.\n\n- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations: separates good from extraordinary.\n   \n- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion) and immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors), rather than relying on any library defaults. Don't make the background dark as a default step, always understand problem first and define colors accordingly\n    Eg: - if it implies playful/energetic, choose a colorful scheme\n           - if it implies monochrome/minimal, choose a black–white/neutral scheme\n\n**Component Reuse:**\n\t- Prioritize using pre-existing components from src/components/ui when applicable\n\t- Create new components that match the style and conventions of existing components when needed\n\t- Examine existing components to understand the project's component patterns before creating new ones\n\n**IMPORTANT**: Do not use HTML based component like dropdown, calendar, toast etc. You **MUST** always use `/app/frontend/src/components/ui/ ` only as a primary components as these are modern and stylish component\n\n**Best Practices:**\n\t- Use Shadcn/UI as the primary component library for consistency and accessibility\n\t- Import path: ./components/[component-name]\n\n**Export Conventions:**\n\t- Components MUST use named exports (export const ComponentName = ...)\n\t- Pages MUST use default exports (export default function PageName() {...})\n\n**Toasts:**\n  - Use `sonner` for toasts\"\n  - Sonner component are located in `/app/src/components/ui/sonner.tsx`\n\nUse 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals."
  ]
}
