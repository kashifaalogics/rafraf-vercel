import { FunctionComponent, useMemo } from "react";
import NextLink, { LinkProps } from "next/link";
import { useAuth } from "@common/hooks";
import { useRouter } from "next/router";

interface Props extends LinkProps {
  href: string;
  needAuth?: boolean;
  rel?: any;
  onNotAllowed?: () => void;
}

const Link: FunctionComponent<Props> = ({
  href,
  rel,
  needAuth = false,
  onNotAllowed = () => {},
  children,
  ...rest
}) => {
  const { loggedIn } = useAuth();
  const { locale, defaultLocale } = useRouter();

  const hrefPrefix = useMemo<string>(
    () =>
      rest.locale
        ? rest.locale === defaultLocale
          ? ""
          : "/" + rest.locale
        : defaultLocale === locale
        ? ""
        : "/" + locale,
    [locale, defaultLocale, rest.locale]
  );

  if (!needAuth || loggedIn) {
    return (
      <NextLink
        passHref={true}
        href={{ pathname: href }}
        as={hrefPrefix + href}
        {...rest}
      >
        <a {...rest} rel={rel}>
          {children}
        </a>
      </NextLink>
    );
  } else {
    return <span onClick={onNotAllowed}>{children}</span>;
  }
};

export default Link;
