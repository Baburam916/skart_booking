import { Transition } from "react-transition-group";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { selectSideMenu } from "../../stores/sideMenuSlice";
import { useAppSelector } from "../../stores/hooks";
import { FormattedMenu, linkTo, nestedMenu, enter, leave } from "./side-menu";
import Lucide from "../../base-components/Lucide";
import logoUrl from "../../assets/images/icons/Side_logo.png";
import clsx from "clsx";
import TopBar from "../../components/TopBar";
import MobileMenu from "../../components/MobileMenu";
import DarkModeSwitcher from "../../components/DarkModeSwitcher";
import MainColorSwitcher from "../../components/MainColorSwitcher";
import SideMenuTooltip from "../../components/SideMenuTooltip";
import Footer from "../../pages/Franchisee/Footer";
import { useLogin } from "../../ContextProvider/LoginContext";
import { useFranchisee } from "../../ContextProvider/FranchiseeContext";

function Main() {
  const { isDirectCust, isOverseas } = useFranchisee();
  const location = useLocation();
  const [formattedMenu, setFormattedMenu] = useState<
    Array<FormattedMenu | "divider">
  >([]);
  const { userdata } = useLogin();
  const permissions =
    userdata?.role_permission?.map((item: any) => item.p_id) || [];
  const sideMenuStore = useAppSelector(selectSideMenu);
  const sideMenu = () => nestedMenu(sideMenuStore, location);

  useEffect(() => {
    setFormattedMenu(sideMenu());
  }, [sideMenuStore, location.pathname]);

  return (
    <div className="">
      {/* <DarkModeSwitcher /> */}
      {/* <MainColorSwitcher /> */}
      <MobileMenu />
      <div className="flex md:mt-0">
        {/* BEGIN: Side Menu */}
        <nav className="overflow-y-scroll h-[89vh] hidden md:block w-[85px] xl:w-[230px]">
          <div className="sticky top-0 bg-[#777779] z-50 pr-5">
            <Link
              to="/franchisee/dashboard"
              className="flex items-center pt-4 pl-2 intro-x"
            >
              <img
                alt="sKart Logo"
                className="w-48"
                src={logoUrl}
                style={{ filter: "drop-shadow(5px 5px 3px #222)" }}
              />
            </Link>
            <Divider type="div" className="my-6"></Divider>
          </div>
          <ul className="pr-5">
            {/* BEGIN: First Child */}
            {formattedMenu
              ?.filter((item?: any) => {
                if (item?.title == "Dashboard") {
                  return item;
                } else if (
                  item?.title == "Chargeable Weight Settings" &&
                  !isDirectCust
                ) {
                  return item;
                } else if (
                  item?.title == "Activate Kavach" &&
                  !isDirectCust &&
                  !isOverseas
                ) {
                  return item;
                } else if (item?.title == "Control Panel" && !isDirectCust) {
                  return item;
                } else if (!item?.id) {
                  if (item?.title == "Manage Masters") {
                    const permission = userdata?.role_permission?.filter(
                      (pitem: any) =>
                        (pitem?.p_id == 39 || pitem?.p_id == 41) &&
                        pitem?.read_permission == 1
                    );
                    if (permission?.length > 0) {
                      return item;
                    }
                    return;
                  } else if (item?.title == "Accounts") {
                    const permission = userdata?.role_permission?.filter(
                      (pitem: any) =>
                        (pitem?.p_id == 95 ||
                          pitem?.p_id == 140 ||
                          pitem?.p_id == 42 ||
                          pitem?.p_id == 70 ||
                          pitem?.p_id == 221 ||
                          pitem?.p_id == 222) &&
                        pitem?.read_permission == 1
                    );
                    if (permission?.length > 0) {
                      return item;
                    }
                    return;
                  } else if (item?.title == "Manage Reports") {
                    const permission = userdata?.role_permission?.filter(
                      (pitem: any) =>
                        (pitem?.p_id == 44 ||
                          pitem?.p_id == 45 ||
                          pitem?.p_id == 46) &&
                        pitem?.read_permission == 1
                    );
                    if (permission?.length > 0) {
                      return item;
                    }
                    return;
                  } else if (item?.title == "Bulk Booking") {
                    const permission = userdata?.role_permission?.filter(
                      (pitem: any) =>
                        pitem?.p_id == 215 && pitem?.read_permission == 1
                    );
                    if (permission?.length > 0) {
                      return item;
                    }
                    return;
                  } else if (item?.title == "Affiliate Programme") {
                    const permission = userdata?.role_permission?.filter(
                      (pitem: any) =>
                        (pitem?.p_id == 410 ||
                          pitem?.p_id == 411 ||
                          pitem?.p_id == 412 ||
                          pitem?.p_id == 413 ||
                          pitem?.p_id == 414) &&
                        pitem?.read_permission == 1
                    );
                    if (permission?.length > 0) {
                      return item;
                    }
                    return;
                  }
                } else {
                  const permission = userdata?.role_permission?.filter(
                    (pitem: any) =>
                      pitem?.p_id == item?.id && pitem?.read_permission == 1
                  );

                  if (permission?.length > 0) {
                    return item;
                  }

                  return;
                }
              })
              ?.map((menu, menuKey) =>
                menu == "divider" ? (
                  <Divider
                    type="li"
                    className={clsx([
                      "my-6",

                      // Animation
                      `opacity-0 animate-[0.4s_ease-in-out_0.1s_intro-divider] animate-fill-mode-forwards animate-delay-${
                        (menuKey + 1) * 10
                      }`,
                    ])}
                    key={menuKey}
                  ></Divider>
                ) : (
                  <li
                    key={menuKey}
                    {...(menu?.id
                      ? { id: `id${menu.id}` }
                      : menu?.title == "Accounts"
                      ? { id: `accounts` }
                      : {})}
                  >
                    <Menu
                      className={clsx({
                        // Animation
                        [`opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay-${
                          (menuKey + 1) * 10
                        }`]: !menu.active,
                      })}
                      menu={menu}
                      formattedMenuState={[formattedMenu, setFormattedMenu]}
                      level="first"
                    ></Menu>
                    {/* BEGIN: Second Child */}
                    {menu.subMenu && (
                      <Transition
                        in={menu.activeDropdown}
                        onEnter={enter}
                        onExit={leave}
                        timeout={300}
                      >
                        <ul
                          className={clsx([
                            "bg-black/10 rounded-lg dark:bg-darkmode-900/30",
                            { block: menu.activeDropdown },
                            { hidden: !menu.activeDropdown },
                          ])}
                        >
                          {menu.subMenu
                            ?.filter((item2) => {
                              const isActivateKavach =
                                item2?.id === 137 &&
                                item2?.pathname ===
                                  "/franchisee/activate_kavach";

                              if (isActivateKavach && isOverseas) {
                                return false;
                              }

                              const isOther137 =
                                item2?.id === 137 &&
                                item2?.pathname !==
                                  "/franchisee/activate_kavach";

                              const permission =
                                userdata?.role_permission?.find(
                                  (pitem: any) =>
                                    pitem?.p_id == item2?.id || item2.id == 137
                                );

                              return (
                                permission?.p_id == 137 ||
                                (permission &&
                                  permission?.read_permission != 0 &&
                                  permissions?.includes(item2?.id))
                              );
                            })
                            ?.sort((a, b) => a.title.localeCompare(b.title)).map((subMenu, subMenuKey) => (
                              <li
                                key={subMenuKey}
                                {...(subMenu?.id
                                  ? { id: `id${subMenu.id}` }
                                  : {})}
                              >
                                <Menu
                                  className={clsx({
                                    // Animation
                                    [`opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay-${
                                      (subMenuKey + 1) * 10
                                    }`]: !subMenu.active,
                                  })}
                                  menu={subMenu}
                                  formattedMenuState={[
                                    formattedMenu,
                                    setFormattedMenu,
                                  ]}
                                  level="second"
                                ></Menu>
                                {/* BEGIN: Third Child */}
                                {subMenu.subMenu && (
                                  <Transition
                                    in={subMenu.activeDropdown}
                                    onEnter={enter}
                                    onExit={leave}
                                    timeout={300}
                                  >
                                    <ul
                                      className={clsx([
                                        "bg-black/10 rounded-lg dark:bg-darkmode-900/30",
                                        {
                                          block: subMenu.activeDropdown,
                                        },
                                        { hidden: !subMenu.activeDropdown },
                                      ])}
                                    >
                                      {subMenu.subMenu.map(
                                        (lastSubMenu, lastSubMenuKey) => (
                                          <li key={lastSubMenuKey}>
                                            <Menu
                                              className={clsx({
                                                // Animation
                                                [`opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay-${
                                                  (lastSubMenuKey + 1) * 10
                                                }`]: !lastSubMenu.active,
                                              })}
                                              menu={lastSubMenu}
                                              formattedMenuState={[
                                                formattedMenu,
                                                setFormattedMenu,
                                              ]}
                                              level="third"
                                            ></Menu>
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </Transition>
                                )}
                                {/* END: Third Child */}
                              </li>
                            ))}
                        </ul>
                      </Transition>
                    )}
                    {/* END: Second Child */}
                  </li>
                )
              )}
            {/* END: First Child */}
          </ul>
        </nav>
        {/* END: Side Menu */}
        {/* BEGIN: Content */}
        <div
          style={{ borderRadius: "30px" }}
          className=" overflow-y-auto min-w-0 min-h-[94vh] h-[94vh] scrollbar-hide pb-4 flex-1 bg-slate-100 dark:bg-darkmode-700 px-2 md:px-[22px] max-w-full md:max-w-auto before:content-[''] before:w-full before:block boxinner"
        >
          <TopBar />
          <Outlet />
        </div>
        {/* END: Content */}
      </div>
      <Footer />
    </div>
  );
}
function Menu(props: {
  className?: string;
  menu: FormattedMenu;
  formattedMenuState: [
    (FormattedMenu | "divider")[],
    Dispatch<SetStateAction<(FormattedMenu | "divider")[]>>
  ];
  level: "first" | "second" | "third";
}) {
  const navigate = useNavigate();
  const [formattedMenu, setFormattedMenu] = props.formattedMenuState;
  return (
    <SideMenuTooltip
      as="a"
      content={props.menu.title}
      href={props.menu.subMenu ? "#" : props.menu.pathname}
      className={clsx([
        "h-[50px] flex items-center pl-5 text-white mb-1 relative rounded-full",
        {
          "dark:text-slate-300": props.menu.active && props.level != "first",
          "text-white/70 dark:text-slate-400":
            !props.menu.active && props.level != "first",
          "z-10 bg-slate-100 dark:bg-darkmode-700":
            props.menu.active && props.level == "first",
          "before:content-[''] before:w-[30px] before:h-[30px] before:-mt-[30px] before:rotate-90 before:scale-[1.04] before:bg-[length:100%] before:bg-menu-corner before:absolute before:top-0 before:right-0 before:-mr-5 dark:before:bg-menu-corner-dark":
            props.menu.active && props.level == "first",
          "after:content-[''] after:w-[30px] after:h-[30px] after:mt-[50px] after:scale-[1.04] after:bg-[length:100%] after:bg-menu-corner after:absolute after:top-0 after:right-0 after:-mr-5 dark:after:bg-menu-corner-dark":
            props.menu.active && props.level == "first",
          "[&>div:nth-child(1)]:hover:before:bg-white/5 [&>div:nth-child(1)]:hover:before:dark:bg-darkmode-500/70":
            !props.menu.active &&
            !props.menu.activeDropdown &&
            props.level == "first",
        },
        props.className,
      ])}
      onClick={(event: React.MouseEvent) => {
        event.preventDefault();
        linkTo(props.menu, navigate);
        setFormattedMenu([...formattedMenu]);
      }}
    >
      <div
        className={clsx({
          "text-primary dark:text-slate-300":
            props.menu.active && props.level == "first",
          "dark:text-slate-400": !props.menu.active && props.level == "first",
          "before:content-[''] before:z-[-1] before:absolute before:top-0 before:right-0 before:-mr-5 before:w-12 before:h-full before:bg-slate-100 before:dark:bg-darkmode-700":
            props.menu.active && props.level == "first",
          "before:content-[''] before:z-[-1] before:w-[230px] before:absolute before:top-0 before:left-0 before:h-full before:rounded-l-full before:transition before:ease-in before:duration-100":
            !props.menu.activeDropdown &&
            !props.menu.active &&
            props.level == "first",
        })}
      >
        <Lucide icon={props.menu.icon} />
      </div>
      <div
        className={clsx([
          "hidden xl:flex items-center w-full ml-3",
          { "font-medium": props.menu.active && props.level != "first" },
          {
            "text-slate-800 font-medium dark:text-slate-300":
              props.menu.active && props.level == "first",
          },
          {
            "dark:text-slate-400": !props.menu.active && props.level == "first",
          },
        ])}
      >
        {props.menu.title}
        {props.menu.subMenu && (
          <div
            className={clsx([
              "transition ease-in duration-100 ml-auto mr-5 hidden xl:block",
              { "transform rotate-180": props.menu.activeDropdown },
            ])}
          >
            <Lucide className="w-4 h-4" icon="ChevronDown" />
          </div>
        )}
      </div>
    </SideMenuTooltip>
  );
}
function Divider<C extends React.ElementType>(
  props: { as?: C } & React.ComponentPropsWithoutRef<C>
) {
  const { className, ...computedProps } = props;
  const Component = props.as || "div";
  return (
    <Component
      {...computedProps}
      className={clsx([
        props.className,
        "w-full h-px bg-white/[0.08] z-10 relative dark:bg-white/[0.07]",
      ])}
    ></Component>
  );
}
export default Main;
