/* eslint-disable */
import React, { useState, useEffect, FC } from "react";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
  CssBaseline,
  Divider,
  Grid,
  Avatar,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { KallosItemCard } from "../../components/KallosItemCard";
import { getAllItems } from "../../store/modules/item";
import { getArtistInfo, getAllItemsOfArtist } from "@/store/modules/artist";
import { RootState } from "../../store/modules";
import { connect } from "react-redux";
import Pagination from "../../components/pagination";
import { BACKEND_URL } from "../../config/index";
import axios from "axios";
import { sizeWidth } from "@mui/system";
import { useRouter } from "next/router";
import Image from "next/image";

const mapStateToProps = (state: RootState) => {
  return {
    artistInfo: state.artistReducer.artistInfo,
    artistItems: state.artistReducer.artistItems,
    items: state.itemReducer.allItems,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    // setArtistInfo: (account) => dispatch(getArtistInfo(account)),
    // setAllItemsOfArtist: (paramsObj) => dispatch(getAllItemsOfArtist(paramsObj)),
    // setAllItems: (params) => dispatch(getAllItems(params)),
  };
};

interface SaleKallosProps {
  account: string;
  items: Array<Object>;
  setAllItems: any;
}

//paramObj
interface ParamObj {
  artistName: string;
  pageNumber: number;
  itemsPerOnePage: number;
}

const artistDetail: FC<SaleKallosProps> = ({ items, setAllItems, account }) => {
  const router = useRouter();
  const userAddress = router.query.address;

  const [onSaleItems, setOnSaleItems] = useState([]);

  const [option, setOption] = useState<string>("");
  const [keyword, setKeyword] = useState<string>("");

  //pagination
  const [curPage, setCurPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const params = {
    searchOption: "users",
    searchKeyword: keyword,
    page: curPage,
    size: itemsPerPage,
  };

  // 작가 정보 불러오기
  const [artistDetail, setArtistDetail] = useState(null);

  const getArtistDetail = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/user/artist/${userAddress}`);
      //   console.log("작가 정보: ", res);
      setArtistDetail(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // 작가의 아이템 불러오기
  const [itemsOfArtist, setItemsOfArtist] = useState(null);
  const getArtistItems = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/user/artist/items`, {
        params: {
          address: userAddress,
          pageNo: curPage,
          itemPerPage: 8,
        },
      });
      //   console.log("작가 아이템 목록: ", res);
      setItemsOfArtist(res.data.items);
      setTotalPages(res.data.totalPage);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getArtistDetail();
    getArtistItems();
  }, [userAddress, curPage]);

  return (
    <div>
      <CssBaseline />
      <main>
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 18,
            pb: 6,
          }}
        >
          <Container>
            <Stack direction="row" sx={{ justifyContent: "center" }}>
              {artistDetail &&
                (artistDetail.profile_img ? (
                  <Avatar sx={{ width: 170, height: 170 }}>
                    <Image
                      layout="fill"
                      src={`https://kallosimages.s3.ap-northeast-2.amazonaws.com/profileImages/${artistDetail.profile_img}`}
                      alt="profile image"
                    />
                  </Avatar>
                ) : (
                  <AccountCircleIcon sx={{ fontSize: 170 }} />
                ))}

              <Box sx={{ m: 2.5 }}>
                <Typography variant="h5" sx={{ my: 1.5 }}>
                  {artistDetail && artistDetail.name}
                </Typography>
                <Typography>
                  {artistDetail &&
                    (artistDetail.description
                      ? artistDetail.description
                      : "소개글이 없습니다.")}
                </Typography>
              </Box>
            </Stack>
            <Divider variant="middle" sx={{ my: 5 }} />
            <Typography variant="h4" align="center">
              작품
            </Typography>
            {itemsOfArtist && itemsOfArtist.length !== 0 ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, 270px)",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 5,
                  rowGap: 5,
                  columnGap: 1,
                }}
              >
                {itemsOfArtist.map((item, index) => (
                  <KallosItemCard key={index} kallosData={item} />
                ))}
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 10,
                  rowGap: 5,
                  columnGap: 1,
                }}
              >
                <Typography>작품이 존재하지 않습니다</Typography>
              </Box>
            )}
          </Container>
          <Pagination
            curPage={curPage}
            setCurPage={setCurPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={totalPages * itemsPerPage}
          />
        </Box>
      </main>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(artistDetail);
