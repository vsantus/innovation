"use client";

import { useEffect, useRef, useState } from "react";
import { faEnvelope, faPhone, faStar, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

type HeaderProps = {
  userName?: string;
  userGroup?: string;
  favoritesCount?: number;
  onFavoritesClick?: () => void;
  onUserClick?: () => void;
};

const styles = {
  header: "bg-brand-green text-white",
  inner: "mx-auto flex min-h-[104px] w-full max-w-[1480px] items-center justify-between gap-8 px-4 py-4 max-[760px]:justify-start md:px-16",
  brand: "flex items-center gap-3 text-white max-[760px]:hidden",
  logo: "block h-auto w-[min(210px,48vw)] object-contain",
  actions:
    "flex flex-wrap items-center justify-end gap-3 max-[760px]:w-full max-[760px]:justify-start max-[460px]:flex-nowrap max-[460px]:gap-2",
  iconButton: "grid h-[42px] w-[42px] cursor-pointer place-items-center rounded-full border-0  text-white max-[460px]:h-8 max-[460px]:w-8",
  favoriteButton:
    "relative grid h-[42px] w-[42px] cursor-pointer place-items-center rounded-full border-0  text-white max-[460px]:h-8 max-[460px]:w-8",
  favoriteBadge:
    "absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-xs font-extrabold text-brand-green",
  profileWrap: "relative ml-auto",
  profile: "flex min-w-[220px] items-center justify-end gap-3 max-[760px]:min-w-0 max-[460px]:gap-2",
  avatarButton: "grid h-7 w-7 cursor-pointer place-items-center border-0 bg-transparent p-0 text-white",
  avatar:
    "grid h-16 w-16 shrink-0 place-items-center rounded-full border-4 border-white bg-white/20 max-[460px]:h-10 max-[460px]:w-10 max-[460px]:border-2",
  userName: "block text-[1.05rem] leading-tight max-[460px]:text-xs",
  userGroup: "mt-1 block text-sm opacity-90 max-[460px]:text-[0.65rem]",
  menu:
    "absolute right-0 top-[calc(100%+0.75rem)] z-30 min-w-36 rounded-lg bg-white py-2 text-product-text shadow-[0_16px_36px_rgba(0,0,0,0.18)]",
  menuButton: "w-full cursor-pointer border-0 bg-transparent px-4 py-2 text-left font-bold text-product-text hover:bg-product-panel",
  confirmBackdrop: "fixed inset-0 z-50 grid place-items-center bg-black/45 px-4",
  confirmDialog: "w-full max-w-[360px] rounded-xl bg-white p-5 text-product-text shadow-[0_24px_70px_rgba(0,0,0,0.28)]",
  confirmTitle: "text-lg font-black",
  confirmText: "mt-2 text-sm text-product-muted",
  confirmActions: "mt-5 flex justify-end gap-3",
  cancelButton: "min-h-10 cursor-pointer rounded-lg border border-product-control bg-white px-4 font-bold text-product-muted",
  logoutButton: "min-h-10 cursor-pointer rounded-lg border-0 bg-brand-green px-4 font-black text-white",
};

export function Header({ userName, userGroup, favoritesCount = 0, onFavoritesClick, onUserClick }: HeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleDocumentMouseDown(event: MouseEvent) {
      if (!profileRef.current?.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleDocumentMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleDocumentMouseDown);
    };
  }, []);

  function openLogoutConfirm() {
    setIsUserMenuOpen(false);
    setIsLogoutConfirmOpen(true);
  }

  function confirmLogout() {
    setIsLogoutConfirmOpen(false);
    onUserClick?.();
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Image
            className={styles.logo}
            src="/logobanner.avif"
            alt="Logo da Innovation"
            width={210}
            height={56}
            priority
          />
        </div>

        <nav className={styles.actions} aria-label="Atalhos do usuário">
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

          <div ref={profileRef} className={styles.profileWrap}>
            <div className={styles.profile}>
              <div className={styles.avatar}>
                <button
                  className={styles.avatarButton}
                  type="button"
                  aria-label="Abrir opções do usuário"
                  aria-expanded={isUserMenuOpen}
                  title="Opções do usuário"
                  onClick={() => setIsUserMenuOpen((current) => !current)}
                >
                  <FontAwesomeIcon className="h-7 w-7" icon={faUser} />
                </button>
              </div>
              <div>
                <strong className={styles.userName}>{userName || "Usuário Innovation"}</strong>
                <span className={styles.userGroup}>{userGroup || "Conta ativa"}</span>
              </div>
            </div>

            {isUserMenuOpen ? (
              <div className={styles.menu} role="menu">
                <button className={styles.menuButton} type="button" role="menuitem" onClick={openLogoutConfirm}>
                  Sair
                </button>
              </div>
            ) : null}
          </div>
        </nav>
      </div>

      {isLogoutConfirmOpen ? (
        <div className={styles.confirmBackdrop} onMouseDown={() => setIsLogoutConfirmOpen(false)}>
          <div
            className={styles.confirmDialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-confirm-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <h2 id="logout-confirm-title" className={styles.confirmTitle}>
              Deseja mesmo sair?
            </h2>
            <p className={styles.confirmText}>Sua sessão será encerrada neste dispositivo.</p>
            <div className={styles.confirmActions}>
              <button className={styles.cancelButton} type="button" onClick={() => setIsLogoutConfirmOpen(false)}>
                Cancelar
              </button>
              <button className={styles.logoutButton} type="button" onClick={confirmLogout}>
                Sair
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
