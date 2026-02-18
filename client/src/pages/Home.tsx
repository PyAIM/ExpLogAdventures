/* Neo-Brutalist Educational Playfulness Design:
 * - Bold geometric cards with thick black borders
 * - Vibrant color blocks for each activity
 * - Offset solid-color drop shadows
 * - Retro arcade aesthetic
 */

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { usePlayer } from "@/contexts/PlayerContext";
import { PlayerNameModal } from "@/components/PlayerNameModal";
import { InstructionsModal } from "@/components/InstructionsModal";
import { CreditsModal } from "@/components/CreditsModal";
import { useState, useEffect } from "react";
import { TrendingUp, Search, DollarSign, Zap, Atom, Calculator, Sigma, FlaskConical, GitCompare, Volume2, VolumeX } from "lucide-react";
import { useAudio } from "@/contexts/AudioContext";

const activities = [
  {
    id: "exponential-explorer",
    title: "Exponential Explorer",
    description: "Master the basics of exponential functions through interactive graph manipulation",
    icon: TrendingUp,
    color: "bg-[oklch(0.55_0.25_265)]", // Electric blue
    shadowColor: "shadow-brutal-blue",
    image: "https://private-us-east-1.manuscdn.com/sessionFile/tpL1IbVtzPZpdO1kykOAog/sandbox/X1GhCwuTOl5zUyGCC6IcNn-img-1_1771355285000_na1fn_aGVyby1leHBvbmVudGlhbC1ncm93dGg.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvdHBMMUliVnR6UFpwZE8xa3lrT0FvZy9zYW5kYm94L1gxR2hDd3VUT2w1elV5R0NDNkljTm4taW1nLTFfMTc3MTM1NTI4NTAwMF9uYTFmbl9hR1Z5YnkxbGVIQnZibVZ1ZEdsaGJDMW5jbTkzZEdnLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=R0MSqhtDZKGZDgZOfBbR1mxGq8LQAfe29Q1mmys1jRp6e4EE-QC95VbGZermVbkkhHsZPf~LwPWIRl9ThbdRlEHeH2arO8LAEsIyQtI85jLuQE9nx6fIICcvhxRFFeRHqqeBIEBuld2z-3ssQk3Emwb8CzJUNYIa1M95SYhjfq~qYhjMdTnrTUKnT90MrzD0RajcUGruJBbGv3rbkvLRuFu0n01dY1S729kiymCe3xN4~OsaEBR0hnFvF2qgWhZBmOK1PrudYWuCOJu-2XUxXmNBmBqvVTpB9Xbq85oCsIOxf31qHB448F6nMhlnUDEglB40t4fYL0UD9IPDeVmrbQ__"
  },
  {
    id: "log-detective",
    title: "Log Detective",
    description: "Crack the code by converting between exponential and logarithmic forms",
    icon: Search,
    color: "bg-[oklch(0.60_0.25_310)]", // Confident purple
    shadowColor: "shadow-brutal-purple",
    image: "https://private-us-east-1.manuscdn.com/sessionFile/tpL1IbVtzPZpdO1kykOAog/sandbox/X1GhCwuTOl5zUyGCC6IcNn-img-2_1771355290000_na1fn_YWN0aXZpdHktbG9nLWRldGVjdGl2ZQ.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvdHBMMUliVnR6UFpwZE8xa3lrT0FvZy9zYW5kYm94L1gxR2hDd3VUT2w1elV5R0NDNkljTm4taW1nLTJfMTc3MTM1NTI5MDAwMF9uYTFmbl9ZV04wYVhacGRIa3RiRzluTFdSbGRHVmpkR2wyWlEucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=qToeo4-6WjfKqM2lTwhlvLkRk-ZxmoYuLDt6MW9KjZJbI7EwssJmlbkz6SIc48XvR8CR-6vX~5u0lwkwx4xfTVqGwZApa7tqQA7ig~vRXMspF7xPnPoJopj6XTHEwx5rfyIbHxamJNrP7IR6ggH3t20aNq-LKk65I2atoU8uO-fef8A~ux0fHjCFJdEYAP0cp~kFBVxYnV3HZtRR~YqIpCr6aTO6ksHfcV8Y7fA7Eoz9jg0ZJgdRC6K8kK1nbeoL7HvL3qbPIdNXRphyVgDEVkQogWhGLxI6H4Gpx677a7Cad0Qp0ZnLVj9H9VHxAMEjLSi76AkVYN6l3syox2hE5A__"
  },
  {
    id: "compound-interest",
    title: "Compound Interest Quest",
    description: "Build your fortune by mastering exponential growth in real-world savings",
    icon: DollarSign,
    color: "bg-[oklch(0.65_0.20_145)]", // Vibrant green
    shadowColor: "shadow-brutal",
    image: "https://private-us-east-1.manuscdn.com/sessionFile/tpL1IbVtzPZpdO1kykOAog/sandbox/X1GhCwuTOl5zUyGCC6IcNn-img-3_1771355284000_na1fn_YWN0aXZpdHktY29tcG91bmQtaW50ZXJlc3Q.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvdHBMMUliVnR6UFpwZE8xa3lrT0FvZy9zYW5kYm94L1gxR2hDd3VUT2w1elV5R0NDNkljTm4taW1nLTNfMTc3MTM1NTI4NDAwMF9uYTFmbl9ZV04wYVhacGRIa3RZMjl0Y0c5MWJtUXRhVzUwWlhKbGMzUS5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=AWlcG0YBtHppHCkPojjafOr1ymsWycoURNySircrA1COzJIN1dskuTZr1jk1HgarXzIzeNjsEPNWOJ~T-ZWEkORyUpTlOjXUy7fry-0JsFGt06FwsZprH-SQJBr4MxWL1VrnKnt8ZdXkP~zvr-enJrWWCEM3CSNWUCy8HB4ypKw4RcuUSud7n055CC0QOwaWhN0CYH0wp~8FWlysMKaNeuS5itFSrUlMNpT905P-t8d8vUoNa4GULmvhcwO7tkk8joRcVZtKP6vQR1NXyEgsVGXMG7qF9DNlXyQ2s90BFeo88NYO5cDxRmG33OhF0~~rgTrSV12WdUkuL4DS5Ip5tQ__"
  },
  {
    id: "viral-video",
    title: "Viral Video Challenge",
    description: "Predict how fast content spreads using exponential growth models",
    icon: Zap,
    color: "bg-[oklch(0.65_0.22_35)]", // Energetic orange
    shadowColor: "shadow-brutal-orange",
    image: "https://private-us-east-1.manuscdn.com/sessionFile/tpL1IbVtzPZpdO1kykOAog/sandbox/X1GhCwuTOl5zUyGCC6IcNn-img-4_1771355289000_na1fn_YWN0aXZpdHktdmlyYWwtdmlkZW8.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvdHBMMUliVnR6UFpwZE8xa3lrT0FvZy9zYW5kYm94L1gxR2hDd3VUT2w1elV5R0NDNkljTm4taW1nLTRfMTc3MTM1NTI4OTAwMF9uYTFmbl9ZV04wYVhacGRIa3RkbWx5WVd3dGRtbGtaVzgucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=r8rwJF6y7uZxEiY~rzIm2GeAG6IDr7QIiTppsHCUx9CUXIFT8ZELy1MAC7uzSUEQngmOXnd11G8AVYw0-6V2Pf2eqMhp0QMgbeiZtGZiJMDPMU-CZoGAKr~0nAnewxgTPWEsSlBUyqvyDsykEwC~-l7-dfshC6HSUUqsOLSjAXT5wgGLKKQIvXCSuYQebAAij4R82~R9RQKJCQj18DQqlVIhMyxuswpOd4vYyWjGhAEegIvW2sAzIhEmKuVBGQCz1dlyCbgAhGUe4ptXnEQSM8pMaRV~lpc8uUsMpbOQ4aLG81F3tpJ52~oyk2vrUcOqhYG-HBki2tq~5o9vtDGsZQ__"
  },
  {
    id: "carbon-dating",
    title: "Carbon Dating Lab",
    description: "Uncover ancient secrets using exponential decay and half-life calculations",
    icon: Atom,
    color: "bg-[oklch(0.65_0.18_40)]", // Terracotta orange
    shadowColor: "shadow-brutal",
    image: "https://private-us-east-1.manuscdn.com/sessionFile/tpL1IbVtzPZpdO1kykOAog/sandbox/X1GhCwuTOl5zUyGCC6IcNn-img-5_1771355280000_na1fn_YWN0aXZpdHktY2FyYm9uLWRhdGluZw.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvdHBMMUliVnR6UFpwZE8xa3lrT0FvZy9zYW5kYm94L1gxR2hDd3VUT2w1elV5R0NDNkljTm4taW1nLTVfMTc3MTM1NTI4MDAwMF9uYTFmbl9ZV04wYVhacGRIa3RZMkZ5WW05dUxXUmhkR2x1WncucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=uRX1sge39NWg8mDYNaoTGvrmXIybA5tsPcaem2L4deWSiCqyQelh8n7Fb0Tk9xArGlCPbDwsVmKvE1XhtEeV4k7SfiTdOmFIBopN9oIhweGhgyEHhctKiNeBNbXAhqeMEgiMB5uUK6GjCNwD9lvS7M8NvEOyMJODZRxiHemO4~8O~6cbuXaD-sD9QScxwxO1pCLNGRbQICKZjDkiy8U3f4w20chZbJ4MlDuzKdqwSIEo65XnMid9g6u~MZ94xnRgc~hMKOQZAinOfLIs8nSyCBVlT7-YDN4bra3LiUN8-gdW3QiUOxw3c9akunov~XVY8gQsIfvkf46lZ4xUgjc5dw__"
  },
  {
    id: "log-laws",
    title: "Logarithm Laws Master",
    description: "Expand and combine logarithmic expressions using logarithm laws",
    icon: Calculator,
    color: "bg-[oklch(0.62_0.24_320)]", // Magenta
    shadowColor: "shadow-brutal-purple",
    image: "https://private-us-east-1.manuscdn.com/sessionFile/tpL1IbVtzPZpdO1kykOAog/sandbox/BmCoN9gz5UipDqwstiUqt7-img-1_1771367262000_na1fn_YWN0aXZpdHktbG9nLWxhd3M.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvdHBMMUliVnR6UFpwZE8xa3lrT0FvZy9zYW5kYm94L0JtQ29OOWd6NVVpcERxd3N0aVVxdDctaW1nLTFfMTc3MTM2NzI2MjAwMF9uYTFmbl9ZV04wYVhacGRIa3RiRzluTFd4aGQzTS5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=GZriIVgkto06-p33-YSf14bDadgyuP~rTdWXFK6OfQLS20rvAnhpI4dtc0V0VjvonsHHk0PXtI6bPBBQ3ULBskglT8D8erVxeDJbRSrjtXRmmZ~2XZ6HzmhfbRwcE42wbuLPDWuCdogBbx7QdVEfKKNyF-oOFP4bj~OolZuhgG3N0PaJaz9PTJXKz~nsNkz4lA0JAtpoH7UyfFMQ0Ga8cmfGyAdI2Igpq72D7G9tvXuWoE51eocO0FtzKhD9tmnsF2GCZm8QTZ5U0m95rRyg4oZ1tkfN88tfi9EVqDkb6lDAkBoupD-1MQyxYDdEkzO8Pzi2uSME3IBxppoUlCKxiA__"
  },
  {
    id: "log-evaluation",
    title: "Logarithm Evaluation Expert",
    description: "Evaluate logarithms using laws and cancellation rules",
    icon: Sigma,
    color: "bg-[oklch(0.60_0.20_180)]", // Teal
    shadowColor: "shadow-brutal",
    image: "https://private-us-east-1.manuscdn.com/sessionFile/tpL1IbVtzPZpdO1kykOAog/sandbox/BmCoN9gz5UipDqwstiUqt7-img-2_1771367265000_na1fn_YWN0aXZpdHktbG9nLWV2YWx1YXRpb24.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvdHBMMUliVnR6UFpwZE8xa3lrT0FvZy9zYW5kYm94L0JtQ29OOWd6NVVpcERxd3N0aVVxdDctaW1nLTJfMTc3MTM2NzI2NTAwMF9uYTFmbl9ZV04wYVhacGRIa3RiRzluTFdWMllXeDFZWFJwYjI0LnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=gcwlq4O-wTmVUneuXlZrtADh3NATBnS5hlbFrFDPdM69v04uM456vUN4b~R1jx7PEzI462GNeHcl3a8BNsRLj~MYk~VOEL5Wu-fGRSqtONjJ07nfj4-qm7JqSwHdSEJlsk6CL~bGZ7jq1OQN7~cLLyXyJOyhp3EBlUPDGsPc9no1R~WlhYQiHckG1JdOmbIkYxSxbowPWiNniTYoBhZT4EVsWq7mO00bReWOlaZwo9Fu60NvIMATlyn7rfry0uuLAD9xtsa9FjZG6KQFivSAbJZmC~pkhMHgLkzZu9ROfoT1K4C2bYiRMU3aYya5ZZsBtzwpwx8s6eFD~vYmTlTkBw__"
  },
  {
    id: "equation-solver",
    title: "Equation Solver Challenge",
    description: "Solve logarithmic and exponential equations algebraically",
    icon: FlaskConical,
    color: "bg-[oklch(0.58_0.22_15)]", // Red-orange
    shadowColor: "shadow-brutal-orange",
    image: "https://private-us-east-1.manuscdn.com/sessionFile/tpL1IbVtzPZpdO1kykOAog/sandbox/BmCoN9gz5UipDqwstiUqt7-img-3_1771367259000_na1fn_YWN0aXZpdHktZXF1YXRpb24tc29sdmVy.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvdHBMMUliVnR6UFpwZE8xa3lrT0FvZy9zYW5kYm94L0JtQ29OOWd6NVVpcERxd3N0aVVxdDctaW1nLTNfMTc3MTM2NzI1OTAwMF9uYTFmbl9ZV04wYVhacGRIa3RaWEYxWVhScGIyNHRjMjlzZG1WeS5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=r-3kWNNJ0JDKNH~gPyiPrwQ2Ty7ZPxFCLfxKXNAPetTan8HO7~V6NL58mnGIQPFIxohWljz6K2TI3kcIao9yUH8G8wrXXUHjUVfz0Q13z9AFTZroFghhmASioQDARKRsGG5nCHCQpepmwbuVtG8h6rvVNOLYG3e1CQwz-kWsp4i9IxniER6iMNFSzShWoLWmNxnu59BoZ44G2-jhT1eEArYQGJ7~ZaUXyo6EfhVpk5~n5rdb8R50mX7J4GceHXolsQj-7KI0wBQfmgqcYA9U8YdfaCY2YEHlRGgZ3XqJsOzc1H79xPNkwYaMcEG1f1BmxY93O5E8SCRZCO~wPYf8FQ__"
  },
  {
    id: "graph-matcher",
    title: "Graph Matcher Challenge",
    description: "Match transformed graphs to their equations",
    icon: GitCompare,
    color: "bg-[oklch(0.55_0.25_190)]", // Teal
    shadowColor: "shadow-brutal",
    image: "https://private-us-east-1.manuscdn.com/sessionFile/tpL1IbVtzPZpdO1kykOAog/sandbox/5vxC3nSQZBU0Qko92xxLyx-img-1_1771371227000_na1fn_YWN0aXZpdHktZ3JhcGgtbWF0Y2hlcg.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvdHBMMUliVnR6UFpwZE8xa3lrT0FvZy9zYW5kYm94LzV2eEMzblNRWkJVMFFrbzkyeHhMeXgtaW1nLTFfMTc3MTM3MTIyNzAwMF9uYTFmbl9ZV04wYVhacGRIa3RaM0poY0dndGJXRjBZMmhsY2cucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=lj-XuEVBGa5xJFgf6jjA6u6J1yM3nxX-2majGG1aUmLFcfXG3GbtLzMk~GNmBnjIqUY0JjUzXiwpuD6hTXd9CmuGdq7zSfHwNJ~V-5olExOf5X6oYggDvYYLj8E2-o3FABreRWSfoN7RioAmiHp-u7S3Oii3KNNbgYpSDHbOL~tk5P~dHfNCj7lXm5TwV1LKU7KSbTuhV1SZriZByGnjcWljar8JRG3D7Cj5T5i6BKwkEyWjICx0zt0bU6wLoDZz2jfZrvZPYf2NGf0RYvWNwRL4y~c3L95eaK3VUHfp71zCG-LAeypa1AsgFUpaQECr5cbcxbl5BgPAu-F~9D1M0w__"
  }
];

export default function Home() {
  const { playerName, totalScore } = usePlayer();
  const { isMuted, toggleMute, playMenuMusic } = useAudio();
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  
  useEffect(() => {
    // Play menu music when home page loads
    playMenuMusic();
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="border-b-[6px] border-foreground bg-[oklch(0.55_0.25_265)] text-white py-12 relative">
        <div className="container">
          {/* Audio Control */}
          <button
            onClick={toggleMute}
            className="absolute top-4 right-4 md:top-8 md:right-8 p-3 border-[4px] border-white hover:bg-white hover:text-[oklch(0.55_0.25_265)] transition-colors"
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted ? <VolumeX className="w-6 h-6" strokeWidth={3} /> : <Volume2 className="w-6 h-6" strokeWidth={3} />}
          </button>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
            Exponential & Logarithmic Adventures
          </h1>
          {playerName && (
            <p className="text-2xl md:text-3xl font-bold mb-2">
              Welcome back, {playerName}! 🎮
            </p>
          )}
          <p className="text-xl md:text-2xl font-medium max-w-3xl">
            Master precalculus through gamified challenges. Choose your adventure below!
          </p>
          {playerName && totalScore > 0 && (
            <p className="text-lg md:text-xl mt-2 font-bold">
              Total Score: <span className="mono text-[oklch(0.70_0.20_55)]">{totalScore}</span>
            </p>
          )}
        </div>
      </header>

      {/* Activity Grid */}
      <main className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <Link key={activity.id} href={`/activity/${activity.id}`}>
                <Card className={`border-[6px] border-foreground ${activity.shadowColor} hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm transition-all cursor-pointer overflow-hidden h-full`}>
                  {/* Activity Image */}
                  <div className={`h-48 ${activity.color} border-b-[6px] border-foreground relative overflow-hidden`}>
                    <img 
                      src={activity.image} 
                      alt={activity.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Activity Content */}
                  <div className="p-6 bg-card">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`${activity.color} p-3 border-[4px] border-foreground`}>
                        <Icon className="w-8 h-8 text-white" strokeWidth={3} />
                      </div>
                      <h2 className="text-2xl font-bold flex-1 leading-tight">
                        {activity.title}
                      </h2>
                    </div>
                    <p className="text-base text-muted-foreground font-medium">
                      {activity.description}
                    </p>
                    <Button 
                      className={`mt-6 w-full ${activity.color} text-white border-[4px] border-foreground shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all font-bold text-lg h-12`}
                    >
                      Start Challenge
                    </Button>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-[6px] border-foreground bg-muted py-8 mt-12">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm font-mono font-medium">
              Built for Precalculus Students • Learn by Playing
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowInstructions(true)}
                className="text-sm font-bold hover:text-[oklch(0.55_0.25_265)] transition-colors underline"
              >
                How to Play
              </button>
              <span className="text-sm">•</span>
              <button
                onClick={() => setShowCredits(true)}
                className="text-sm font-bold hover:text-[oklch(0.55_0.25_265)] transition-colors underline"
              >
                Credits
              </button>
            </div>
          </div>
        </div>
      </footer>
      <PlayerNameModal />
      <InstructionsModal open={showInstructions} onClose={() => setShowInstructions(false)} />
      <CreditsModal open={showCredits} onClose={() => setShowCredits(false)} />
    </div>
  );
}
