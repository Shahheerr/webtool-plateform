"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CommandPalette } from "@/components/command-palette"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion, AnimatePresence } from "framer-motion"

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-border/50 backdrop-blur-xl bg-background/80 shadow-sm">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-md"
                        >
                            <span className="text-lg font-bold text-white">W</span>
                        </motion.div>
                        <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            WebTools
                        </span>
                    </Link>

                    <nav className="hidden items-center gap-6 md:flex">
                        <Link
                            href="/#tools"
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground relative group"
                        >
                            <span>Tools</span>
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all group-hover:w-full" />
                        </Link>
                        <Link
                            href="/#categories"
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground relative group"
                        >
                            <span>Categories</span>
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all group-hover:w-full" />
                        </Link>
                        <Link
                            href="/#about"
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground relative group"
                        >
                            <span>About</span>
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all group-hover:w-full" />
                        </Link>
                    </nav>

                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative hover:bg-accent/50"
                            onClick={() => setIsSearchOpen(true)}
                        >
                            <Search className="h-5 w-5" />
                            <span className="sr-only">Search tools</span>
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden hover:bg-accent/50"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            <span className="sr-only">Toggle menu</span>
                        </Button>

                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button className="hidden md:flex bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-md hover:shadow-lg transition-all">
                                Get Started
                            </Button>
                        </motion.div>
                    </div>
                </div>

                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-border/50 md:hidden overflow-hidden"
                        >
                            <nav className="container mx-auto flex flex-col gap-4 p-4">
                                <Link
                                    href="/#tools"
                                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Tools
                                </Link>
                                <Link
                                    href="/#categories"
                                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Categories
                                </Link>
                                <Link
                                    href="/#about"
                                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    About
                                </Link>
                                <Button className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                                    Get Started
                                </Button>
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            <CommandPalette open={isSearchOpen} onOpenChange={setIsSearchOpen} />
        </>
    )
}
