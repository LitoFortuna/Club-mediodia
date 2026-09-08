// <picture> con fuente WebP y respaldo JPEG. La clase y el resto de props
// van al <img>, que es el elemento que se maquetea.
type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  webp: string;
  jpg: string;
  wrapperClassName?: string;
};

export function Pic({ webp, jpg, alt = "", wrapperClassName, ...img }: Props) {
  return (
    <picture className={wrapperClassName}>
      <source srcSet={webp} type="image/webp" />
      <img src={jpg} alt={alt} {...img} />
    </picture>
  );
}
