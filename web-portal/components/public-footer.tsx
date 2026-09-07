"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";

const academyVideos = [
  {
    title: "See the agency build in action",
    eyebrow: "Kydos Academy",
    description: "A quick look at the systems, team and infrastructure behind the programme.",
    src: "https://resource2.heygen.ai/aws_pacific/avatar_tmp/3f442aeb30f44b2dafefca148edf7ab7/v924cfe3d88324664a27c176a8944ddd2/caption_54e022efab61433081e42b2649310f91.mp4",
    poster: "https://resource2.heygen.ai/video/54e022efab61433081e42b2649310f91/v924cfe3d88324664a27c176a8944ddd2/gif.gif"
  },
  {
    title: "Start your own social media agency",
    eyebrow: "The offer in under a minute",
    description: "See how the Blueprint, systems and Done For You support come together.",
    src: "https://resource2.heygen.ai/aws_pacific/avatar_tmp/3f442aeb30f44b2dafefca148edf7ab7/v41568bc0afc342ed8a099dec453b177e/caption_d866107e7a8e40b5ad2f22309a4a3b77.mp4",
    poster: "https://resource2.heygen.ai/video/d866107e7a8e40b5ad2f22309a4a3b77/v41568bc0afc342ed8a099dec453b177e/gif.gif"
  }
];

export function PublicFooter() {
  const pathname = usePathname();
  const showHomepageVideos = pathname === "/";

  return (
    <>
      {showHomepageVideos ? (
        <section className="academy-home-video-section" aria-labelledby="academy-home-video-title">
          <div className="container">
            <div className="academy-home-video-head">
              <span className="eyebrow">See what you are actually building</span>
              <h2 id="academy-home-video-title">A real agency needs more than a course.</h2>
              <p>
                Watch the short videos, then book a consultation if you want to discuss the right build route for you.
              </p>
            </div>

            <div className="academy-home-video-grid">
              {academyVideos.map((video) => (
                <article className="academy-home-video-card" key={video.title}>
                  <div className="academy-home-video-frame">
                    <video
                      controls
                      playsInline
                      preload="metadata"
                      poster={video.poster}
                      aria-label={video.title}
                    >
                      <source src={video.src} type="video/mp4" />
                      Your browser does not support embedded video.
                    </video>
                  </div>
                  <div className="academy-home-video-copy">
                    <span>{video.eyebrow}</span>
                    <h3>{video.title}</h3>
                    <p>{video.description}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="academy-home-video-cta">
              <div>
                <strong>Programmes from £2,500</strong>
                <span>Choose the level of support that matches how hands-on you want to be.</span>
              </div>
              <Link className="btn btn-primary" href="/consultation">Book your agency consultation</Link>
            </div>
          </div>

          <style>{`
            .academy-home-video-section {
              padding: 88px 0;
              border-top: 1px solid rgba(255,255,255,.06);
              background:
                radial-gradient(circle at 20% 0%, rgba(74, 222, 128, .08), transparent 34%),
                linear-gradient(180deg, rgba(7, 17, 31, .98), rgba(5, 13, 24, 1));
            }
            .academy-home-video-head {
              max-width: 760px;
              margin: 0 auto 34px;
              text-align: center;
            }
            .academy-home-video-head h2 {
              margin: 14px 0 12px;
              font-size: clamp(32px, 4vw, 54px);
              line-height: 1.03;
            }
            .academy-home-video-head p {
              margin: 0 auto;
              max-width: 650px;
              color: #9eb0c3;
              line-height: 1.7;
            }
            .academy-home-video-grid {
              display: grid;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 24px;
              max-width: 980px;
              margin: 0 auto;
            }
            .academy-home-video-card {
              overflow: hidden;
              border: 1px solid rgba(255,255,255,.08);
              border-radius: 24px;
              background: rgba(255,255,255,.025);
              box-shadow: 0 24px 70px rgba(0,0,0,.24);
            }
            .academy-home-video-frame {
              padding: 14px;
              background: rgba(255,255,255,.018);
            }
            .academy-home-video-frame video {
              display: block;
              width: 100%;
              aspect-ratio: 9 / 16;
              max-height: 690px;
              object-fit: cover;
              border-radius: 16px;
              background: #02070d;
            }
            .academy-home-video-copy {
              padding: 20px 22px 24px;
            }
            .academy-home-video-copy > span {
              display: block;
              margin-bottom: 8px;
              color: #8fe383;
              font-size: 10px;
              font-weight: 850;
              letter-spacing: .08em;
              text-transform: uppercase;
            }
            .academy-home-video-copy h3 {
              margin: 0 0 9px;
              font-size: 20px;
            }
            .academy-home-video-copy p {
              margin: 0;
              color: #95a8bb;
              font-size: 13px;
              line-height: 1.6;
            }
            .academy-home-video-cta {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 20px;
              max-width: 980px;
              margin: 24px auto 0;
              padding: 20px 22px;
              border: 1px solid rgba(143,227,131,.16);
              border-radius: 18px;
              background: rgba(143,227,131,.045);
            }
            .academy-home-video-cta strong {
              display: block;
              margin-bottom: 4px;
              font-size: 18px;
            }
            .academy-home-video-cta span {
              color: #95a8bb;
              font-size: 12px;
            }
            @media (max-width: 820px) {
              .academy-home-video-section { padding: 64px 0; }
              .academy-home-video-grid { grid-template-columns: 1fr; max-width: 520px; }
              .academy-home-video-frame video { max-height: none; }
              .academy-home-video-cta {
                max-width: 520px;
                align-items: stretch;
                flex-direction: column;
              }
              .academy-home-video-cta .btn { width: 100%; }
            }
          `}</style>
        </section>
      ) : null}

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <Link href="/" className="brand" aria-label="Kydos Academy home">
              <BrandLogo variant="light" className="academy-logo-footer" />
            </Link>
            <p>
              A Kydos Digital programme for building a structured UK digital marketing agency.
            </p>
          </div>

          <div>
            <strong>Explore</strong>
            <p>
              <Link href="/programme">Programme</Link><br />
              <Link href="/compare">Compare plans</Link><br />
              <Link href="/consultation">Consultation</Link><br />
              <Link href="/blog">Agency guides</Link><br />
              <a href="https://kydosdigital.com">Kydos Digital</a>
            </p>
          </div>

          <div>
            <strong>Participants</strong>
            <p>
              <Link href="/login">Login</Link><br />
              <Link href="/legal/terms">Terms</Link><br />
              <Link href="/legal/refunds">Refunds</Link><br />
              <Link href="/legal/privacy">Privacy</Link>
            </p>
          </div>

          <div>
            <strong>Contact</strong>
            <p>
              Support@kydosdigital.com<br />
              +44 7860 254271<br />
              Manchester, United Kingdom
            </p>
          </div>
        </div>

        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} KYDOS DIGITAL LTD. All rights reserved.</span>
          <span>Kydos Academy is operated by KYDOS DIGITAL LTD.</span>
        </div>
      </footer>
    </>
  );
}
