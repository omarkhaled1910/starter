#!/usr/bin/env bash
#
# Reads sprite data from stdin and outputs a bitmap version
# with the given palette.
#
# Author: Dave Eddy <dave@daveeddy.com>
# Date: July 29, 2025
# License: MIT

#!/usr/bin/env bash
#
# Library for generating a BMP image in bash
#
# Author: Dave Eddy <dave@daveeddy.com>
# Date: July 30, 2025
# License: MIT

u32le() {
	local n=$1 out

	# convert number into 4 octets
	# ex: input = 0x12345678
	# octet1: 0x12
	# octet2: 0x34
	# octet3: 0x56
	# octet4: 0x78
	local octet1=$(( (n >> 24) & 0xFF))
	local octet2=$(( (n >> 16) & 0xFF))
	local octet3=$(( (n >> 8)  & 0xFF))
	local octet4=$(( (n >> 0)  & 0xFF))

	printf -v out '\\x%02x\\x%02x\\x%02x\\x%02x' \
	    "$octet4" \
	    "$octet3" \
	    "$octet2" \
	    "$octet1"
	printf '%b' "$out"
}

u16le() {
	local n=$1 out

	# convert number into 2 octets
	# ex: input = 0x1234
	# octet1: 0x12
	# octet2: 0x34
	local octet1=$(( (n >> 8) & 0xFF))
	local octet2=$(( (n >> 0) & 0xFF))

	printf -v out '\\x%02x\\x%02x' \
	    "$octet2" \
	    "$octet1"
	printf '%b' "$out"
}

bmp-rgb() {
	local r=$1
	local g=$2
	local b=$3
	local out

	printf -v out '\\x%02x\\x%02x\\x%02x' \
	    "$b" \
	    "$g" \
	    "$r"
	printf '%b' "$out"
}

bmp-pad() {
	local padding=$1 i
	for ((i = 0; i < padding; i++)); do
		printf '\0'
	done
}

bmp-header() {
	local width=$1
	local height=$2

	local bits_per_px=24
	local bytes_per_px=$((bits_per_px / 8))

	local row_size=$((width * bytes_per_px))

	# align to a 4 byte boundary
	local padding=0
	while ((row_size % 4 != 0)); do
		((padding++))
		((row_size++))
	done

	local pixel_data_size=$((row_size * height))
	local pixel_data_offset=$((14 + 40))

	# size of entire file
	local file_size=$((pixel_data_size + pixel_data_offset))

	# Header (14 bytes)
	## Signature
	printf 'BM'

	## FileSize
	u32le "$file_size"

	## Reserved (=0)
	u32le 0

	## DataOffset
	u32le "$pixel_data_offset"

	# InfoHeader (40 bytes)
	## Size
	u32le 40

	## Width
	u32le "$width"

	## Height
	u32le "$height"

	## Planes (=1)
	u16le 1

	## BitCount
	u16le "$bits_per_px"

	## Compression
	u32le 0

	## ImageSize
	u32le 0

	## XPixelsPerM
	u32le 0

	## YPixelsPerM
	u32le 0

	## ColorsUsed
	u32le 0

	## ColorsImportant
	u32le 0

	REPLY=$padding
}

declare -A PALETTE

debug() {
	echo '[debug]' "$@" >&2
}

make-bmp() {
	local SPRITE
	mapfile -t SPRITE

	local width=${#SPRITE[0]}
	local height=${#SPRITE[@]}

	bmp-header "$width" "$height"
	local padding=$REPLY

	local r g b y x
	for ((y = 0; y < height; y++)); do
		for ((x = 0; x < width; x++)); do
			local c=${SPRITE[height - y - 1]}
			c=${c:x:1}

			local r g b
			read -r r g b <<< "${PALETTE[$c]}"
			bmp-rgb "$r" "$g" "$b"
		done
		debug "handled row $y/$height"
		bmp-pad "$padding"
	done
}

hex2rgb() {
	local hex=${1#\#}

	local r=$((16#${hex:0:2}))
	local g=$((16#${hex:2:2}))
	local b=$((16#${hex:4:2}))

	echo "$r $g $b"
}

load-palette() {
	local file=$1

	local lines
	mapfile -t lines < "$file" || exit

	local line
	for line in "${lines[@]}"; do
		local c hex
		c=${line:0:1}
		hex=${line:2}

		PALETTE[$c]=$(hex2rgb "$hex")
	done
}

main() {
	local output=out.bmp

	local palette
	local OPTIND OPTARG opt
	while getopts 'p:o:' opt; do
		case "$opt" in
			o) output=$OPTARG;;
			p) palette=$OPTARG;;
		esac
	done

	[[ -n $palette ]] || exit
	load-palette "$palette"

	make-bmp > "$output" || exit
	echo "generated image: $output"
}

main "$@"
