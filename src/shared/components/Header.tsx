"use client";

import { faEnvelope, faPhone, faStar, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type HeaderProps = {
  userName?: string;
  userGroup?: string;
  favoritesCount?: number;
  onFavoritesClick?: () => void;
};

const styles = {
  header: "bg-brand-green text-white",
  inner: "mx-auto flex min-h-[104px] w-full max-w-[1480px] items-center justify-between gap-8 px-4 py-4 md:px-16",
  brand: "flex items-center gap-3 text-white",
  logo: "block h-auto w-[min(210px,48vw)] object-contain",
  actions: "flex flex-wrap items-center justify-end gap-3 max-[460px]:grid max-[460px]:grid-cols-[repeat(3,42px)_1fr]",
  iconButton: "grid h-[42px] w-[42px] cursor-pointer place-items-center rounded-full border-0  text-white",
  favoriteButton: "relative grid h-[42px] w-[42px] cursor-pointer place-items-center rounded-full border-0  text-white",
  favoriteBadge:
    "absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-xs font-extrabold text-brand-green",
  profile: "flex min-w-[220px] items-center gap-3 max-[760px]:min-w-0 max-[460px]:col-span-full",
  avatar: "grid h-16 w-16 place-items-center rounded-full border-4 border-white bg-white/20",
  userName: "block text-[1.05rem] leading-tight",
  userGroup: "mt-1 block text-sm opacity-90",
};

export function Header({ userName, userGroup, favoritesCount = 0, onFavoritesClick }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <img
            className={styles.logo}
            src="/bannerinnovation.png"
            alt="Logo da Innovation"
            width={281}
            height={127}
          />
        </div>

        <nav className={styles.actions} aria-label="Atalhos do usuario">
          <button
            className={styles.favoriteButton}
            type="button"
            aria-label="Produtos favoritos"
            title="Produtos favoritos"
            onClick={onFavoritesClick}
          >
            <FontAwesomeIcon className="h-5 w-5" icon={faStar} />
            {favoritesCount > 0 ? (
              <span className={styles.favoriteBadge}>{favoritesCount}</span>
            ) : null}
          </button>

          <button
            className={styles.iconButton}
            type="button"
            aria-label="Mensagens"
            title="Mensagens"
          >
            <FontAwesomeIcon className="h-5 w-5" icon={faEnvelope} />
          </button>

          <button
            className={styles.iconButton}
            type="button"
            aria-label="Telefone"
            title="Telefone"
          >
            <FontAwesomeIcon className="h-5 w-5" icon={faPhone} />
          </button>

          <div className={styles.profile} aria-label="Usuario logado">
            <div className={styles.avatar}>
              <FontAwesomeIcon className="h-7 w-7" icon={faUser} />
            </div>
            <div>
              <strong className={styles.userName}>{userName || "Usuario Innovation"}</strong>
              <span className={styles.userGroup}>{userGroup || "Conta ativa"}</span>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
