"use client";

import Link from "next/link";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import MuiLink from "@mui/material/Link";
import Typography from "@mui/material/Typography";

export default function CollectionBreadcrumb() {
    return (
        <Breadcrumbs
            aria-label="breadcrumb"
            separator="/"
            sx={{
                px: { xs: "1.25rem", md: "1.75rem" },
                pt: { xs: "1rem", md: "2rem" },
                pb: 0,
                backgroundColor: "var(--color-cream)",
                "& .MuiLink-root, & .MuiTypography-root": {
                    fontSize: "0.75rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--color-warm-gray)",
                },
            }}
        >
            <MuiLink component={Link} underline="hover" color="inherit" href="/">
                Home
            </MuiLink>
            <Typography
                color="text.primary"
                sx={{
                    fontWeight: 700,
                    textDecoration: "underline",
                    textUnderlineOffset: "0.18em",
                }}
            >
                Collection
            </Typography>
        </Breadcrumbs>
    );
}
