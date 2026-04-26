const styles = {
  shell: "grid min-h-[520px] w-full max-w-[234px] justify-self-center gap-3 border border-product-border bg-white p-3",
  block: "animate-pulse rounded-lg bg-product-divider",
};

export function ProductSkeleton() {
  return (
    <article className={styles.shell} aria-label="Carregando produto">
      <div className={`${styles.block} h-[78px]`} />
      <div className={`${styles.block} h-[232px]`} />
      <div className={`${styles.block} h-5`} />
      <div className={`${styles.block} h-5 w-2/3`} />
      <div className={`${styles.block} h-10`} />
    </article>
  );
}
