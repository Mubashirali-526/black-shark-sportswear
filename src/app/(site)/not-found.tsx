import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="grid min-h-[70vh] place-items-center bg-ink px-6 text-center text-white">
      <div>
        <p className="font-display text-[7rem] font-extrabold leading-none tracking-tighter text-white/10 sm:text-[10rem]">
          404
        </p>
        <h1 className="-mt-4 font-display text-3xl font-bold sm:text-4xl">
          Off the pitch.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-white/60">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back in the game.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <ButtonLink href="/" variant="white">
            Back Home
          </ButtonLink>
          <ButtonLink
            href="/products"
            variant="outline"
            className="border-white/30 text-white hover:bg-white hover:text-ink"
          >
            Shop Products
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
