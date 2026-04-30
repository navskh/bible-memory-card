import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface LinkItem {
  index?: number;
  label: string;
  sublabel?: string;
  href: string;
}

interface StaggeredCardProps extends React.ComponentProps<'div'> {
  links: LinkItem[];
  delay?: number;
  openingDelay?: number;
  title?: string;
  icon?: React.ReactNode;
  direction?: 'up' | 'down';
  align?: 'left' | 'right';
}

export default function StaggeredCard({
  links,
  className,
  delay = 0.04,
  openingDelay = 0.05,
  title,
  icon,
  direction = 'down',
  align = 'left',
  ...props
}: StaggeredCardProps) {
  const router = useRouter();
  const easeOut = [0, 0, 0.2, 1];

  const [open, setOpen] = useState(false);
  const [hoverRect, setHoverRect] = useState<DOMRect | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const containerRect = containerRef.current?.getBoundingClientRect();

  function updateHoverRect(e: React.MouseEvent<HTMLLIElement, MouseEvent>) {
    setHoverRect(e.currentTarget.getBoundingClientRect());
  }

  function resetHoverRect() {
    setHoverRect(null);
  }

  const toggleOpen = () => {
    setOpen(prev => !prev);
  };

  const clickHandler = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    href: string,
  ) => {
    e.preventDefault();
    if (props.onClick) {
      props.onClick(e as any);
    } else {
      router.push(href);
    }
    setOpen(false);
  };

  const Chevron = direction === 'up' ? ChevronUp : ChevronDown;

  return (
    <div className={cn('relative z-50 h-fit w-fit', className)} {...props}>
      <button
        type="button"
        onClick={toggleOpen}
        className={cn(
          'group flex cursor-pointer items-center gap-2 rounded-full border border-zinc-200 bg-white/90 px-4 py-2 text-sm font-semibold text-zinc-800 shadow-md shadow-zinc-900/5 backdrop-blur transition-all',
          'hover:bg-white hover:shadow-lg hover:shadow-zinc-900/10 active:scale-95',
          open && 'bg-white shadow-lg ring-2 ring-amber-500/30',
        )}
        aria-expanded={open}
      >
        {icon && (
          <span className="flex size-5 items-center justify-center text-amber-600">
            {icon}
          </span>
        )}
        <span className="tracking-tight">{title}</span>
        <Chevron
          className={cn(
            'size-4 text-zinc-400 transition-transform',
            open && 'text-zinc-600',
          )}
          strokeWidth={2.5}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial="closed"
            animate="open"
            exit="closed"
            variants={{
              closed: { scale: 0.92, opacity: 0, y: direction === 'up' ? 8 : -8 },
              open: { scale: 1, opacity: 1, y: 0 },
            }}
            transition={{
              duration: 0.18,
              ease: easeOut as any,
              delay: openingDelay,
            }}
            className={cn(
              'absolute z-50 max-h-[60vh] w-max min-w-56 overflow-y-auto rounded-2xl border border-zinc-100 bg-white/95 p-1.5 shadow-2xl shadow-zinc-900/15 backdrop-blur',
              align === 'right' ? 'right-0' : 'left-0',
              direction === 'up'
                ? align === 'right'
                  ? 'bottom-full mb-3 origin-bottom-right'
                  : 'bottom-full mb-3 origin-bottom-left'
                : align === 'right'
                  ? 'top-full mt-3 origin-top-right'
                  : 'top-full mt-3 origin-top-left',
            )}
          >
            <div
              ref={containerRef}
              className="relative"
              onMouseLeave={resetHoverRect}
            >
              {/* hover effect */}
              <AnimatePresence>
                {hoverRect && containerRect && (
                  <motion.div
                    initial="hidden"
                    animate="shown"
                    exit="hidden"
                    variants={{
                      hidden: {
                        x: hoverRect.left - containerRect.left,
                        y: hoverRect.top - containerRect.top,
                        width: hoverRect.width,
                        height: hoverRect.height,
                        opacity: 0,
                      },
                      shown: {
                        x: hoverRect.left - containerRect.left,
                        y: hoverRect.top - containerRect.top,
                        width: hoverRect.width,
                        height: hoverRect.height,
                        opacity: 1,
                      },
                    }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute left-0 top-0 rounded-xl bg-amber-50"
                  />
                )}
              </AnimatePresence>
              {links.map((link, i) => {
                return (
                  <motion.li
                    key={`${link.label}-${i}`}
                    onMouseOver={updateHoverRect}
                    initial={{ opacity: 0, y: direction === 'up' ? 6 : -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.22,
                      ease: easeOut as any,
                      delay: i * delay + openingDelay,
                    }}
                  >
                    <a
                      className="group relative z-10 block max-w-72 cursor-pointer rounded-xl px-4 py-2.5 transition-colors"
                      data-index={link.index}
                      onClick={e => clickHandler(e, link.href)}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="truncate text-sm font-semibold text-zinc-900 group-hover:text-amber-700">
                          {link.label}
                        </span>
                        {link.sublabel && (
                          <span className="truncate text-xs font-medium uppercase tracking-wider text-amber-600/80">
                            {link.sublabel}
                          </span>
                        )}
                      </div>
                    </a>
                  </motion.li>
                );
              })}
            </div>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
