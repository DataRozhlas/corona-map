import json
import requests
from datetime import datetime
import boto3

s3 = boto3.client('s3')

url = 'https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/kraj-okres-nakazeni-vyleceni-umrti.min.json'

def scrape(event, context):
    dta = requests.get(url).json()['data']
    
    ltst = None
    ltst_stampt = 0
    for rec in dta:
        dat = datetime.strptime(rec['datum'], '%Y-%m-%d')
        dat = datetime.timestamp(dat)
        if dat > ltst_stampt:
            ltst = rec['datum']
            ltst_stampt = dat

    last_day = list(filter(lambda x: x['datum'] == ltst, dta))
    out = list(map(lambda x: list(x.values())[2:], last_day))

    reg = s3.put_object(Bucket='datarozhlas',
                        Key='covid-uzis/okresy.json', 
                        Body=json.dumps({
                            'data': out,
                            'upd': ltst,
                        }, ensure_ascii=False),
                        ACL='public-read',
                        ContentType='application/json')
    
    return {
        'statusCode': 200,
        'body': json.dumps('cajk')
    }
